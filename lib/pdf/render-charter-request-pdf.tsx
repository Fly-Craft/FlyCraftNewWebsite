import { renderToBuffer } from "@react-pdf/renderer";
import CharterRequestPdf from "./CharterRequestPdf";
import type { CharterRequestPayload } from "@/lib/charter-request";

export async function renderCharterRequestPdf(
  data: CharterRequestPayload,
  requestId: string,
  generatedAt: string
): Promise<Buffer> {
  return renderToBuffer(
    <CharterRequestPdf data={data} requestId={requestId} generatedAt={generatedAt} />
  );
}
