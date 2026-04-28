import { cn } from "@/lib/utils";

/**
 * Allowlist protokol URL agar markdown link `[label](javascript:...)`
 * tidak bisa jadi vektor klik berbahaya. http(s), mailto, tel, dan path relatif (/, #) diizinkan.
 */
function isSafeUrl(url: string): boolean {
  if (!url) return false;
  const trimmed = url.trim();
  if (trimmed.startsWith("/") || trimmed.startsWith("#") || trimmed.startsWith("?")) return true;
  const safePrefix = /^(https?:|mailto:|tel:)/i;
  return safePrefix.test(trimmed);
}

/**
 * Render inline markdown: **bold**, __bold__, *italic*, _italic_, `code`, [text](url), ~~strike~~
 * Returns array of strings/JSX. Aman untuk dipakai di dalam <p>, <li>, dll.
 */
export function processInlineText(text: string): (string | JSX.Element)[] {
  const parts: (string | JSX.Element)[] = [];
  // Order penting: bold (**, __) diuji sebelum italic (*, _) supaya `**x**` tidak match italic dulu.
  const regex =
    /(\*\*[^*\n]+?\*\*|__[^_\n]+?__|`[^`\n]+?`|~~[^~\n]+?~~|\[[^\]]+?\]\([^\)]+?\)|(?<![*\w])\*[^*\n]+?\*(?!\w)|(?<![_\w])_[^_\n]+?_(?!\w))/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  let key = 0;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) parts.push(text.slice(lastIndex, match.index));
    const m = match[0];
    if ((m.startsWith("**") && m.endsWith("**")) || (m.startsWith("__") && m.endsWith("__"))) {
      parts.push(<strong key={key++}>{m.slice(2, -2)}</strong>);
    } else if (m.startsWith("~~") && m.endsWith("~~")) {
      parts.push(<s key={key++}>{m.slice(2, -2)}</s>);
    } else if (m.startsWith("`") && m.endsWith("`")) {
      parts.push(
        <code key={key++} className="bg-muted/70 px-1 py-0.5 rounded text-[0.85em] font-mono">
          {m.slice(1, -1)}
        </code>
      );
    } else if (m.startsWith("[")) {
      const linkMatch = m.match(/^\[([^\]]+)\]\(([^\)]+)\)$/);
      if (linkMatch && isSafeUrl(linkMatch[2])) {
        parts.push(
          <a
            key={key++}
            href={linkMatch[2]}
            target="_blank"
            rel="noopener noreferrer"
            className="underline text-primary hover:opacity-80"
          >
            {linkMatch[1]}
          </a>
        );
      } else if (linkMatch) {
        // URL tidak aman → tampilkan label saja (jangan jadikan tautan klik)
        parts.push(<span key={key++}>{linkMatch[1]}</span>);
      } else {
        parts.push(m);
      }
    } else if (m.startsWith("*") || m.startsWith("_")) {
      parts.push(<em key={key++}>{m.slice(1, -1)}</em>);
    } else {
      parts.push(m);
    }
    lastIndex = match.index + m.length;
  }
  if (lastIndex < text.length) parts.push(text.slice(lastIndex));
  return parts.length > 0 ? parts : [text];
}

/**
 * Render seluruh pesan chat (multi-line) dengan formatting markdown ringan.
 * Handle: # ## ### heading, - * + bullet, 1. ordered list, > blockquote,
 * --- separator, ``` code block, plus inline (bold/italic/code/link/strike).
 *
 * Output: <div> berisi <p>/<ul>/<ol>/<h*>/<blockquote>. Ramah untuk chat bubble.
 */
export function MessageContent({ text, className }: { text: string; className?: string }) {
  const lines = (text || "").split("\n");
  const elements: JSX.Element[] = [];
  let listItems: string[] = [];
  let listType: "ul" | "ol" = "ul";
  let inList = false;
  let inCode = false;
  let codeBuffer: string[] = [];

  const flushList = () => {
    if (listItems.length > 0) {
      const Tag = listType;
      elements.push(
        <Tag
          key={`list-${elements.length}`}
          className={cn("space-y-1", listType === "ol" ? "list-decimal pl-5" : "list-disc pl-5")}
        >
          {listItems.map((item, i) => (
            <li key={i}>{processInlineText(item)}</li>
          ))}
        </Tag>
      );
      listItems = [];
      inList = false;
    }
  };

  const flushCode = () => {
    if (codeBuffer.length > 0) {
      elements.push(
        <pre
          key={`code-${elements.length}`}
          className="bg-muted/80 rounded-md p-2 text-xs font-mono overflow-x-auto"
        >
          <code>{codeBuffer.join("\n")}</code>
        </pre>
      );
      codeBuffer = [];
    }
  };

  for (const raw of lines) {
    const line = raw.replace(/\r$/, "");

    // Code block fence
    if (/^```/.test(line.trim())) {
      flushList();
      if (!inCode) {
        inCode = true;
      } else {
        flushCode();
        inCode = false;
      }
      continue;
    }
    if (inCode) {
      codeBuffer.push(line);
      continue;
    }

    const trimmed = line.trim();

    if (!trimmed) {
      flushList();
      continue;
    }

    // Horizontal rule
    if (/^---+$|^\*\*\*+$|^___+$/.test(trimmed)) {
      flushList();
      elements.push(<hr key={`hr-${elements.length}`} className="my-2 border-border" />);
      continue;
    }

    // Heading
    const headingMatch = trimmed.match(/^(#{1,6})\s+(.+)$/);
    if (headingMatch) {
      flushList();
      const level = headingMatch[1].length;
      const sizeClass =
        level === 1 ? "text-base font-bold mt-2 mb-1" :
        level === 2 ? "text-[15px] font-semibold mt-2 mb-1" :
        "text-sm font-semibold mt-1.5 mb-0.5";
      elements.push(
        <p key={`h-${elements.length}`} className={sizeClass}>
          {processInlineText(headingMatch[2])}
        </p>
      );
      continue;
    }

    // Blockquote
    const quoteMatch = trimmed.match(/^>\s*(.*)$/);
    if (quoteMatch) {
      flushList();
      elements.push(
        <blockquote
          key={`q-${elements.length}`}
          className="border-l-2 border-primary/40 pl-3 italic text-muted-foreground my-1"
        >
          {processInlineText(quoteMatch[1])}
        </blockquote>
      );
      continue;
    }

    // Unordered list
    const ulMatch = trimmed.match(/^[-*+]\s+(.+)$/);
    if (ulMatch) {
      if (!inList || listType !== "ul") {
        flushList();
        inList = true;
        listType = "ul";
      }
      listItems.push(ulMatch[1]);
      continue;
    }

    // Ordered list
    const olMatch = trimmed.match(/^\d+\.\s+(.+)$/);
    if (olMatch) {
      if (!inList || listType !== "ol") {
        flushList();
        inList = true;
        listType = "ol";
      }
      listItems.push(olMatch[1]);
      continue;
    }

    // Default paragraph
    flushList();
    elements.push(
      <p key={`p-${elements.length}`} className="leading-relaxed">
        {processInlineText(trimmed)}
      </p>
    );
  }

  flushList();
  flushCode();

  return <div className={cn("space-y-1.5", className)}>{elements}</div>;
}
