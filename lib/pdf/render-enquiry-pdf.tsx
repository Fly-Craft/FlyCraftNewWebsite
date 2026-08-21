import { renderToBuffer } from "@react-pdf/renderer";
import EnquiryPdf, { type EnquiryPdfData } from "./EnquiryPdf";

export async function renderEnquiryPdf(
  data: EnquiryPdfData,
  reference: string,
  generatedAt: string
): Promise<Buffer> {
  return renderToBuffer(
    <EnquiryPdf data={data} reference={reference} generatedAt={generatedAt} />
  );
}
