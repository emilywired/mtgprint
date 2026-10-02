import type { Card } from "./card";

function isDigit(s: string): boolean {
  return /^\d+$/.test(s);
}

export function removeDoubleSidedName(s: string): string {
  if (!s.includes("/")) return s;
  return s.substring(0, s.indexOf("/") - 1);
}

function parseLine(line: string): Card {
  let name = "";
  let quantity = 1;
  let set;
  let collectorNumber;

  const parts = line.split(" ");

  if (!line.startsWith("1996 World Champion")) {
    const quantityString = parts.at(0)!.replace("x", "");
    if (isDigit(quantityString)) {
      const parsedQuantity = parseInt(quantityString);
      if (!Number.isNaN(parsedQuantity)) {
        quantity = parsedQuantity;
        parts.splice(0, 1);
      }
    }
  }

  const rest = parts.join(" ");

  const openParenthesisIndex =
    rest.indexOf("(") !== -1 ? rest.indexOf("(") : rest.indexOf("[");
  const closedParenthesisIndex =
    rest.indexOf(")") !== -1 ? rest.indexOf(")") : rest.indexOf("]");

  if (openParenthesisIndex !== -1 && closedParenthesisIndex !== -1) {
    set = rest.substring(openParenthesisIndex + 1, closedParenthesisIndex);
    name = rest.substring(0, openParenthesisIndex).trimEnd();

    const maybeCollectorNumber = rest
      .substring(closedParenthesisIndex + 1)
      .trimStart();
    if (maybeCollectorNumber.length) collectorNumber = maybeCollectorNumber;
  } else {
    name = rest;
  }

  name = removeDoubleSidedName(name);

  const card: Card = {
    name,
    quantity,
    set,
    collectorNumber,
  };

  console.log(card);

  return card;
}

export function parseDecklist(decklist: string): Card[] {
  if (!decklist.trim().length) return [];

  const lines = decklist
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length != 0);

  return lines.map((line) => parseLine(line));
}
