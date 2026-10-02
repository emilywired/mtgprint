import type { Card } from "./card";

const CORS_PROXY_URL = "https://proxy.corsfix.com/?";

export async function fetchMoxfieldDeckData(deckId: string) {
  // TODO: backend
  console.log(deckId);
  const apiUrl = `https://api2.moxfield.com/v2/decks/all/${deckId}/`;

  const result = await fetch(CORS_PROXY_URL + apiUrl);
  console.log(result);
}

export async function fetchArchidektDeckData(deckId: string) {
  // TODO: backend
  const apiUrl = `https://archidekt.com/api/decks/${deckId}/`;

  const result = await fetch(CORS_PROXY_URL + apiUrl);
  console.log(result);
}

export async function fetchScryfall(cards: Card[]) {
  const result = await fetch("https://api.scryfall.com/cards/collection", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      identifiers: cards.map((card) => ({
        name: card.name,
        set: card.set,
        collector_number: card.collectorNumber,
      })),
    }),
  });

  const data = await result.json();

  console.log(data);
}
