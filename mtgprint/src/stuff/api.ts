import type { Card, CardWithImages } from "./card";
import { removeDoubleSidedName } from "./parser";

const CORS_PROXY_URL = "https://proxy.corsfix.com/?";

export async function fetchMoxfieldDeckData(deckId: string): Promise<Card[]> {
  // TODO: backend
  console.log(deckId);
  const apiUrl = `https://api2.moxfield.com/v2/decks/all/${deckId}/`;

  const result = await fetch(CORS_PROXY_URL + apiUrl);
  console.log(result);

  return [];
}

export async function fetchArchidektDeckData(deckId: string): Promise<Card[]> {
  // TODO: backend
  const apiUrl = `https://archidekt.com/api/decks/${deckId}/`;

  const result = await fetch(CORS_PROXY_URL + apiUrl);

  const body = await result.json();

  const cards: Card[] = body.cards.map((cardData: any) => ({
    quantity: cardData.quantity,
    name: removeDoubleSidedName(cardData.card.oracleCard.name),
    set: cardData.card.edition.editioncode,
    collectorNumber: cardData.card.collectorNumber,
  }));

  console.log(cards);

  return cards;
}

export async function fetchScryfall(cards: Card[]): Promise<CardWithImages[]> {
  const cardImageUris: string[][] = [];

  const cardQueue = cards.slice();

  while (cardQueue.length > 0) {
    const cardBatch = cardQueue.splice(0, 75);

    const result = await fetch("https://api.scryfall.com/cards/collection", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        identifiers: cardBatch.map((card) => ({
          name: card.name,
          set: card.set,
          collector_number: card.collectorNumber,
        })),
      }),
    });

    // TODO: add tokens

    const data = await result.json();

    for (const item of data.data) {
      try {
        cardImageUris.push([item.image_uris.png]);
      } catch {
        cardImageUris.push([
          item.card_faces[0].image_uris.png,
          item.card_faces[1].image_uris.png,
        ]);
      }
    }
  }

  return cards.map((card, i) => ({
    quantity: card.quantity,
    name: card.name,
    set: card.set,
    collectorNumber: card.collectorNumber,
    imgUris: cardImageUris[i],
  }));
}
