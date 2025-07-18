import React from "react";

const normalizeText = (str: string) =>
  str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

export function highlightText(
  text: string,
  searchTerm: string
): React.ReactNode {
  if (!searchTerm.trim()) {
    return text;
  }

  const normalizedSearch = normalizeText(searchTerm);
  const escapedSearch = normalizedSearch.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const regex = new RegExp(`(${escapedSearch})`, "gi");

  const parts = text.split(regex);

  return parts.map((part, index) => {
    const isMatch = normalizeText(part) === normalizedSearch;
    return isMatch ? (
      <strong key={index} className="font-bold text-blue-400">
        {part}
      </strong>
    ) : (
      part
    );
  });
}
