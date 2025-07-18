import React from "react";

export const normalizeText = (str: string): string => {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
};

export function highlightText(
  text: string,
  searchTerm: string
): React.ReactNode {
  if (!searchTerm.trim()) return text;

  const normalizedSearch = normalizeText(searchTerm);
  const normalizedText = normalizeText(text);
  const matchIndex = normalizedText.indexOf(normalizedSearch);

  if (matchIndex === -1) return text;

  const start = text.slice(0, matchIndex).length;
  const end = start + normalizedSearch.length;

  return (
    <>
      {text.substring(0, start)}
      <strong className="font-bold" style={{ color: "#0092FF" }}>
        {text.substring(start, end)}
      </strong>
      {text.substring(end)}
    </>
  );
}
