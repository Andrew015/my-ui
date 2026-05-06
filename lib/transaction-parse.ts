/** 从 exchangeContent 多行文本中解析「前缀：值」 */
export function parseExchangeLine(content: string | undefined, prefix: string): string | undefined {
  if (!content) return undefined;
  for (const line of content.split(/\r?\n/)) {
    const t = line.trim();
    if (t.startsWith(prefix)) return t.slice(prefix.length).trim() || undefined;
  }
  return undefined;
}

export function parseSwapWish(content: string | undefined): string | undefined {
  return parseExchangeLine(content, "我想交换：");
}

export function parseSwapNote(content: string | undefined): string | undefined {
  return parseExchangeLine(content, "补充说明：");
}
