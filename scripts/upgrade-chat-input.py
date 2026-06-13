#!/usr/bin/env python3
"""
Batch-upgrades all MultiClaw/Panduan chat pages to use ChatInputBar + MessageActions.
Run from project root: python scripts/upgrade-chat-input.py
"""
import os
import re
import sys

PAGES_DIR = "client/src/pages"

# Files to upgrade: all *-claw.tsx and panduan-*.tsx
def get_target_files():
    files = []
    for name in sorted(os.listdir(PAGES_DIR)):
        if name.endswith(".tsx") and ("-claw" in name or name.startswith("panduan-") or name.startswith("teras-")):
            files.append(os.path.join(PAGES_DIR, name))
    return files

def upgrade_file(filepath):
    filename = os.path.basename(filepath)
    with open(filepath, encoding="utf-8") as f:
        content = f.read()

    # Already upgraded
    if "ChatInputBar" in content:
        print(f"  SKIP (already upgraded): {filename}")
        return False

    # No Input import — different pattern, skip
    if 'import { Input } from "@/components/ui/input"' not in content:
        print(f"  SKIP (no Input import): {filename}")
        return False

    # No sendMessage — skip
    if "sendMessage" not in content:
        print(f"  SKIP (no sendMessage): {filename}")
        return False

    original = content

    # ─── 1. Remove Input import ───────────────────────────────────────────────
    content = re.sub(r'\nimport \{ Input \} from "@/components/ui/input";', "", content)

    # ─── 2. Add ChatInputBar import after first block of imports ──────────────
    # Find the last consecutive import line
    lines = content.split("\n")
    last_import_idx = -1
    for i, line in enumerate(lines):
        if line.startswith("import "):
            last_import_idx = i
    if last_import_idx >= 0:
        lines.insert(last_import_idx + 1, 'import { ChatInputBar, MessageActions, AttachmentRow, ChatAttachment } from "@/components/chat-input-bar";')
        content = "\n".join(lines)

    # ─── 3. Add attachments? to Message interface ─────────────────────────────
    # Find Message interface and add attachments field if not present
    def add_to_interface(m):
        body = m.group(0)
        if "attachments?" in body:
            return body
        # Add before closing brace
        return body.rstrip().rstrip("}").rstrip() + "\n  attachments?: ChatAttachment[];\n}"
    content = re.sub(
        r'interface Message \{[^}]+\}',
        add_to_interface,
        content,
        flags=re.DOTALL
    )

    # ─── 4. Modify sendMessage signature + body ───────────────────────────────
    # Change signature: sendMessage(text: string) → sendMessage(text: string, files: ChatAttachment[] = [])
    content = re.sub(
        r'async function sendMessage\(text: string\)',
        'async function sendMessage(text: string, files: ChatAttachment[] = [])',
        content
    )

    # Change the guard condition to allow files-only send
    content = re.sub(
        r'if \(!text\.trim\(\) \|\| streaming \|\| !agentId\) return;',
        'if ((!text.trim() && files.length === 0) || streaming || !agentId) return;',
        content
    )

    # Remove standalone setInput(""); before setStreaming(true)
    content = re.sub(
        r'\n    setInput\(""\);\n    setStreaming\(true\);',
        '\n    setStreaming(true);',
        content
    )

    # Update userMsg creation to include attachments
    content = re.sub(
        r'const userMsg: Message = \{ role: "user", content: text \};',
        'const userMsg: Message = { role: "user", content: text, attachments: files.length ? files : undefined };',
        content
    )

    # Add attachments to fetch body (JSON.stringify call)
    content = re.sub(
        r'(body: JSON\.stringify\(\{[^}]*conversationHistory: history\s*)\}(\s*\)\s*[,;])',
        lambda m: m.group(1) + ', ...(files.length ? { attachments: files } : {})' + '}' + m.group(2),
        content
    )

    # Fix focus call (inputRef → textareaRef or just remove if problematic)
    content = re.sub(r'inputRef\.current\?\.focus\(\);', '// input focus handled by ChatInputBar', content)

    # ─── 5. Remove old input state + ref variables ────────────────────────────
    content = re.sub(r'\n  const \[input, setInput\] = useState\(""\);\n', '\n', content)
    content = re.sub(r'\n  const inputRef = useRef<HTMLInputElement>\(null\);\n', '\n', content)

    # ─── 6. Add `group` class to assistant ChatMessage outer div ─────────────
    # Find the assistant return in ChatMessage and add group class
    # Pattern: <div className="flex justify-start mb-4"> or <div className="flex gap-3 mb-4">
    def add_group_class(m):
        cls = m.group(1)
        if "group" in cls:
            return m.group(0)
        return m.group(0).replace(cls, cls.rstrip() + " group", 1)

    # Match assistant message wrapper (not user, which has "flex justify-end")
    content = re.sub(
        r'<div className="(flex (?:justify-start|gap-3) mb-4)">\s*\n\s*<div',
        lambda m: m.group(0).replace(m.group(1), m.group(1) + " group"),
        content
    )

    # ─── 7. Add MessageActions after content in ChatMessage ───────────────────
    # Find the orchestrationMs block and add MessageActions after it
    # Pattern: </div>\n        )}\n      </div>\n    </div>\n  );\n}  (closing of ChatMessage function)

    # Strategy: find the orchestrationMs rendering block and add MessageActions after
    ma_insertion = '\n        {!msg.isStreaming && msg.content && <MessageActions content={msg.content} />}'

    # Pattern 1: after orchestrationMs div
    content = re.sub(
        r'(\{msg\.orchestrationMs[^}]+\}\s*</div>\s*\n\s*\})',
        lambda m: m.group(0) + ma_insertion,
        content
    )
    # Pattern 2: if no orchestrationMs, add after SubAgentPanel or content div
    # Check if MessageActions was already added
    if "MessageActions" not in content or (content.count("MessageActions") == 1 and 'import' in content):
        # Add before the closing of the assistant message branch
        content = re.sub(
            r'(\{msg\.subAgents && msg\.subAgents\.length > 0 && \(\s*\n\s*<SubAgentPanel[^}]+/>\s*\n\s*\)\s*\})',
            lambda m: m.group(0) + ma_insertion,
            content
        )

    # ─── 8. Update user message to show attachments ───────────────────────────
    # Add AttachmentRow before the content div in user message
    # Pattern: <div className="flex justify-end mb-4"><div className="max-w-[85%] ...
    content = re.sub(
        r'(<div className="flex justify-end mb-4">\s*\n\s*)(<div className="max-w-\[85%\])',
        lambda m: m.group(1) + '<div className="flex flex-col items-end gap-1.5">\n        {msg.attachments && <AttachmentRow attachments={msg.attachments} />}\n        ' + m.group(2),
        content
    )
    # Close the extra wrapper (add </div> before the outer closing div of user message)
    # This is tricky — let's do a simpler approach: just prepend AttachmentRow inside existing div
    # Actually let me revert the above and use a simpler pattern
    # Revert the complex wrapper approach
    content = re.sub(
        r'(<div className="flex justify-end mb-4">\s*\n\s*)<div className="flex flex-col items-end gap-1\.5">\s*\n\s*\{msg\.attachments && <AttachmentRow attachments=\{msg\.attachments\} />\}\s*\n\s*(<div className="max-w-\[85%\])',
        lambda m: m.group(1) + m.group(2),
        content
    )

    # ─── 9. Extract placeholder + footer text, then replace input section ─────
    # Extract placeholder from old Input
    placeholder_match = re.search(
        r'placeholder=\{ready \? "(.*?)"[^}]+\}',
        content
    )
    placeholder = placeholder_match.group(1) if placeholder_match else "Ketik pesan…"

    footer_match = re.search(
        r'<span className="text-\[10px\] text-white/20">(.*?)</span>',
        content
    )
    footer_text = footer_match.group(1) if footer_match else ""

    # Find and replace the entire input section
    # Match from the shrink-0 border-t div to the end of the clear-chat button block
    input_section_pattern = re.compile(
        r'\s*<div className="shrink-0 border-t border-white/10 px-4 py-3 [^"]*">.*?</div>\s*\n\s*</div>',
        re.DOTALL
    )

    # Build replacement
    replacement = f'''
      <ChatInputBar
        onSend={{sendMessage}}
        disabled={{!ready || streaming}}
        streaming={{streaming}}
        placeholder={{ready ? "{placeholder}" : "Memuat…"}}
        footerText="{footer_text}"
        showClear={{messages.length > 0}}
        onClear={{() => setMessages([])}}
      />'''

    # Try to replace the input section
    new_content = input_section_pattern.sub(replacement, content, count=1)
    if new_content == content:
        # Fallback: try without the outer wrapper matching
        input_section_pattern2 = re.compile(
            r'\n      <div className="shrink-0 border-t border-white/10 px-4 py-3[^>]*">.*?</div>\s*\n      </div>',
            re.DOTALL
        )
        new_content = input_section_pattern2.sub("\n" + replacement, content, count=1)

    content = new_content

    # ─── 10. Clean up unused useState (for input/setInput), useRef (for inputRef) ──
    # Already handled in step 5

    # ─── 11. Fix: remove leftover Input usages ────────────────────────────────
    # If Input is still referenced (some pages have multiple Input usages for other purposes)
    # We leave them as-is since we only removed the chat Input

    if content == original:
        print(f"  WARN (no changes made): {filename}")
        return False

    with open(filepath, "w", encoding="utf-8") as f:
        f.write(content)

    print(f"  OK: {filename}")
    return True

def main():
    files = get_target_files()
    print(f"Found {len(files)} candidate files")
    updated = 0
    skipped = 0
    for fp in files:
        result = upgrade_file(fp)
        if result:
            updated += 1
        else:
            skipped += 1
    print(f"\nDone: {updated} updated, {skipped} skipped")

if __name__ == "__main__":
    main()
