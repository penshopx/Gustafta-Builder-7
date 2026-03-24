// Notion integration via Replit Connectors
// Uses ReplitConnectors proxy - never cache the client, tokens expire
import { ReplitConnectors } from "@replit/connectors-sdk";

async function notionProxy(endpoint: string, options: RequestInit = {}) {
  const connectors = new ReplitConnectors();
  const response = await connectors.proxy("notion", endpoint, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });
  return response.json();
}

export async function searchNotionPages(query: string) {
  return notionProxy("/v1/search", {
    method: "POST",
    body: JSON.stringify({
      query,
      filter: { value: "page", property: "object" },
      sort: { direction: "descending", timestamp: "last_edited_time" },
      page_size: 20,
    }),
  });
}

export async function searchNotionDatabases(query: string) {
  return notionProxy("/v1/search", {
    method: "POST",
    body: JSON.stringify({
      query,
      filter: { value: "database", property: "object" },
      sort: { direction: "descending", timestamp: "last_edited_time" },
      page_size: 20,
    }),
  });
}

export async function getNotionPage(pageId: string) {
  return notionProxy(`/v1/pages/${pageId}`);
}

export async function getNotionBlockChildren(blockId: string, cursor?: string) {
  const qs = cursor ? `?start_cursor=${cursor}` : "";
  return notionProxy(`/v1/blocks/${blockId}/children${qs}`);
}

function richTextToPlain(richText: any[]): string {
  return (richText || []).map((t: any) => t.plain_text || "").join("");
}

function blocksToMarkdown(blocks: any[]): string {
  const lines: string[] = [];
  for (const block of blocks) {
    const type = block.type;
    const data = block[type];
    if (!data) continue;
    switch (type) {
      case "paragraph":
        lines.push(richTextToPlain(data.rich_text));
        break;
      case "heading_1":
        lines.push(`# ${richTextToPlain(data.rich_text)}`);
        break;
      case "heading_2":
        lines.push(`## ${richTextToPlain(data.rich_text)}`);
        break;
      case "heading_3":
        lines.push(`### ${richTextToPlain(data.rich_text)}`);
        break;
      case "bulleted_list_item":
        lines.push(`• ${richTextToPlain(data.rich_text)}`);
        break;
      case "numbered_list_item":
        lines.push(`- ${richTextToPlain(data.rich_text)}`);
        break;
      case "to_do":
        lines.push(`[${data.checked ? "x" : " "}] ${richTextToPlain(data.rich_text)}`);
        break;
      case "toggle":
        lines.push(richTextToPlain(data.rich_text));
        break;
      case "quote":
        lines.push(`> ${richTextToPlain(data.rich_text)}`);
        break;
      case "callout":
        lines.push(`💡 ${richTextToPlain(data.rich_text)}`);
        break;
      case "divider":
        lines.push("---");
        break;
      case "code":
        lines.push(`\`\`\`\n${richTextToPlain(data.rich_text)}\n\`\`\``);
        break;
      default:
        break;
    }
  }
  return lines.filter(Boolean).join("\n");
}

export async function extractNotionPageContent(pageId: string): Promise<string> {
  const allBlocks: any[] = [];
  let cursor: string | undefined;
  do {
    const res: any = await getNotionBlockChildren(pageId, cursor);
    allBlocks.push(...(res.results || []));
    cursor = res.next_cursor ?? undefined;
  } while (cursor);
  return blocksToMarkdown(allBlocks);
}

export function getNotionPageTitle(page: any): string {
  const props = page.properties || {};
  const titleProp =
    Object.values(props).find((p: any) => p.type === "title") as any;
  if (titleProp?.title) return richTextToPlain(titleProp.title);
  return page.id;
}

export async function createNotionPage(
  parentPageId: string,
  title: string,
  markdownContent: string
) {
  const lines = markdownContent.split("\n");
  const children: any[] = [];

  for (const line of lines) {
    if (!line.trim()) {
      children.push({
        object: "block",
        type: "paragraph",
        paragraph: { rich_text: [] },
      });
      continue;
    }
    if (line.startsWith("# ")) {
      children.push({ object: "block", type: "heading_1", heading_1: { rich_text: [{ type: "text", text: { content: line.slice(2) } }] } });
    } else if (line.startsWith("## ")) {
      children.push({ object: "block", type: "heading_2", heading_2: { rich_text: [{ type: "text", text: { content: line.slice(3) } }] } });
    } else if (line.startsWith("### ")) {
      children.push({ object: "block", type: "heading_3", heading_3: { rich_text: [{ type: "text", text: { content: line.slice(4) } }] } });
    } else if (line.startsWith("• ") || line.startsWith("- ")) {
      children.push({ object: "block", type: "bulleted_list_item", bulleted_list_item: { rich_text: [{ type: "text", text: { content: line.slice(2) } }] } });
    } else if (line.startsWith("> ")) {
      children.push({ object: "block", type: "quote", quote: { rich_text: [{ type: "text", text: { content: line.slice(2) } }] } });
    } else {
      children.push({ object: "block", type: "paragraph", paragraph: { rich_text: [{ type: "text", text: { content: line } }] } });
    }
    if (children.length >= 95) break;
  }

  return notionProxy("/v1/pages", {
    method: "POST",
    body: JSON.stringify({
      parent: { page_id: parentPageId },
      properties: {
        title: {
          title: [{ type: "text", text: { content: title } }],
        },
      },
      children,
    }),
  });
}

export async function getNotionWorkspacePages() {
  return notionProxy("/v1/search", {
    method: "POST",
    body: JSON.stringify({
      filter: { value: "page", property: "object" },
      sort: { direction: "descending", timestamp: "last_edited_time" },
      page_size: 50,
    }),
  });
}
