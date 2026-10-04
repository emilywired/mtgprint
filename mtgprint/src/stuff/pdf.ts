import jsPDF from "jspdf";

interface Params {
  gapMm: number;
}

export async function generatePDF(
  imageElements: Iterable<HTMLImageElement>,
  params: Params = { gapMm: 2 },
) {
  const doc = new jsPDF({ unit: "mm" });

  const pageWidth = 210;
  const pageHeight = 297;
  const cardWidth = 63;
  const cardHeight = 88;
  const marginX = (pageWidth - cardWidth * 3 - params.gapMm * 2) / 2;
  const marginY = (pageHeight - cardHeight * 3 - params.gapMm * 2) / 2;

  const imageCache: Map<HTMLImageElement, Uint8Array> = new Map();

  let row = 0;
  let column = 0;
  for (const imageElement of imageElements) {
    let rawImage = imageCache.get(imageElement);
    if (rawImage === undefined) {
      const raw = await imageElementToUint8Array(imageElement);
      imageCache.set(imageElement, raw);
      rawImage = raw;
    }

    doc.addImage(
      rawImage,
      "png",
      marginX + params.gapMm * column + cardWidth * column,
      marginY + params.gapMm * row + cardHeight * row,
      cardWidth,
      cardHeight,
      undefined,
      "NONE",
    );

    if (++column == 3) {
      column = 0;
      row++;
    }

    if (row == 3) {
      doc.addPage();
      row = 0;
    }
  }

  doc.save("deck.pdf");
}

async function imageElementToUint8Array(
  imgElement: HTMLImageElement,
): Promise<Uint8Array> {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Could not get 2D context");

  canvas.width = imgElement.naturalWidth;
  canvas.height = imgElement.naturalHeight;

  ctx.drawImage(imgElement, 0, 0);

  const blob = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob((b) => resolve(b), "image/png"),
  );
  if (!blob) throw new Error("Blob conversion failed");

  const arrayBuffer = await blob.arrayBuffer();
  return new Uint8Array(arrayBuffer);
}

function addBleed() {}

function addSquareCorners() {}
