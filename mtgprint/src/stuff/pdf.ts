import jsPDF from "jspdf";

interface Params {}

async function imageElementToUint8Array(
  imgElement: HTMLImageElement,
): Promise<Uint8Array> {
  const canvas = document.createElement("canvas");
  canvas.width = imgElement.naturalWidth;
  canvas.height = imgElement.naturalHeight;

  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Could not get 2D context");

  ctx.drawImage(imgElement, 0, 0);

  const blob = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob((b) => resolve(b), "image/png"),
  );

  if (!blob) throw new Error("Blob conversion failed");

  const arrayBuffer = await blob.arrayBuffer();
  return new Uint8Array(arrayBuffer);
}

export async function generatePDF(
  imageElements: Iterable<HTMLImageElement>,
  params?: Params,
) {
  const doc = new jsPDF({ unit: "mm" });

  // TODO: Promise.all
  for (const imgElement of imageElements) {
    const rawBytes = await imageElementToUint8Array(imgElement);
    doc.addImage(rawBytes, "png", 0, 0, 63, 88, undefined, "NONE");
    doc.save("page-1.pdf");
    break;
  }
}
