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

  // Helper: split baris pipe table jadi sel-sel (buang pipe terdepan/terakhir kalau ada)
  const splitRow = (s: string): string[] => {
    let t = s.trim();
    if (t.startsWith("|")) t = t.slice(1);
    if (t.endsWith("|")) t = t.slice(0, -1);
    return t.split("|").map((c) => c.trim());
  };

  // Pola garis pemisah header tabel: |---|:---|---:|:---:| (boleh tanpa pipe luar)
  const isTableSeparator = (s: string): boolean => {
    const t = s.trim();
    if (!/[-:|]/.test(t)) return false;
    return /^\|?\s*:?-{2,}:?\s*(\|\s*:?-{2,}:?\s*)+\|?\s*$/.test(t);
  };

  // Pola baris tabel: minimal punya 1 pipe internal dan diapit/diakhiri |
  const isTableRow = (s: string): boolean => {
    const t = s.trim();
    if (!t.includes("|")) return false;
    return /^\|.*\|.*$|^.*\|.*\|$/.test(t);
  };

  for (let i = 0; i < lines.length; i++) {
    const raw = lines[i];
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

    // Tabel pipe markdown: butuh baris header + baris pemisah |---|---|
    if (
      isTableRow(trimmed) &&
      i + 1 < lines.length &&
      isTableSeparator(lines[i + 1])
    ) {
      flushList();
      const headerCells = splitRow(trimmed);
      const sepCells = splitRow(lines[i + 1]);
      // Tentukan alignment per kolom dari pola separator (:--- left, :---: center, ---: right)
      const aligns: Array<"left" | "center" | "right"> = sepCells.map((c) => {
        const left = c.startsWith(":");
        const right = c.endsWith(":");
        if (left && right) return "center";
        if (right) return "right";
        return "left";
      });
      const rows: string[][] = [];
      let j = i + 2;
      while (j < lines.length && isTableRow(lines[j].trim())) {
        rows.push(splitRow(lines[j]));
        j++;
      }
      const colCount = Math.max(headerCells.length, ...rows.map((r) => r.length));
      const padCells = (r: string[]) => {
        const out = r.slice(0, colCount);
        while (out.length < colCount) out.push("");
        return out;
      };
      const alignClass = (idx: number) =>
        aligns[idx] === "center" ? "text-center" : aligns[idx] === "right" ? "text-right" : "text-left";

      elements.push(
        <div
          key={`table-wrap-${elements.length}`}
          className="my-3 -mx-1 overflow-x-auto rounded-md border-2 border-border shadow-sm bg-background"
        >
          <table className="w-full text-xs border-collapse">
            <thead>
              <tr className="bg-primary/15 border-b-2 border-border">
                {padCells(headerCells).map((cell, ci) => (
                  <th
                    key={ci}
                    className={cn(
                      "border-r border-border last:border-r-0 px-3 py-2 font-bold text-foreground align-top whitespace-normal",
                      alignClass(ci)
                    )}
                  >
                    {processInlineText(cell)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((r, ri) => (
                <tr
                  key={ri}
                  className={cn(
                    "border-b border-border/70 last:border-b-0",
                    ri % 2 === 1 ? "bg-muted/30" : "bg-background"
                  )}
                >
                  {padCells(r).map((cell, ci) => (
                    <td
                      key={ci}
                      className={cn(
                        "border-r border-border/40 last:border-r-0 px-3 py-2 align-top whitespace-normal leading-snug",
                        alignClass(ci)
                      )}
                    >
                      {processInlineText(cell)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
      i = j - 1; // lompat ke baris terakhir tabel; loop akan ++
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
