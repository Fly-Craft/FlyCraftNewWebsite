import { Document, Page, View, Text, StyleSheet } from "@react-pdf/renderer";
import { registerFonts } from "./fonts";
import {
  PdfHeader,
  PdfFooter,
  chrome,
  page,
  NAVY,
  INK_3,
  BORDER,
} from "./chrome";

registerFonts();

const styles = StyleSheet.create({
  page,
  title: { fontWeight: 100, fontSize: 27, color: NAVY, marginBottom: 24 },
  messageCard: {
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 16,
    padding: 22,
    marginBottom: 12,
  },
});

/** One label-over-value pair. Blank values are dropped by the caller. */
function Field({ label, value }: { label: string; value: string }) {
  return (
    <View style={chrome.fieldCol}>
      <Text style={chrome.fieldLabel}>{label}</Text>
      <Text style={chrome.fieldValue}>{value}</Text>
    </View>
  );
}

export type EnquiryPdfData = {
  /** "Contact Enquiry", or the programme's own label. */
  kind: string;
  name: string;
  email?: string;
  phone?: string;
  message?: string;
  /** Programme-specific answers, already labelled by the caller. */
  extras?: { label: string; value: string }[];
};

/**
 * The enquiry forms as a one-page document, drawn with the same chrome as the
 * charter request so a lead arrives looking like it came from CRAFT rather
 * than from a form.
 *
 * Deliberately simpler than the charter PDF: an enquiry has no route, no
 * times and no aircraft, so the page is the person, what they asked about,
 * and anything the programme wanted to know.
 */
export default function EnquiryPdf({
  data,
  reference,
  generatedAt,
}: {
  data: EnquiryPdfData;
  reference: string;
  generatedAt: string;
}) {
  const contact = [
    ...(data.email?.trim() ? [{ label: "Email", value: data.email.trim() }] : []),
    ...(data.phone?.trim() ? [{ label: "Phone", value: data.phone.trim() }] : []),
  ];
  const extras = (data.extras ?? []).filter((x) => x.value.trim() !== "");
  const message = data.message?.trim();

  return (
    <Document title={`${data.kind} — ${data.name}`}>
      <Page size="LETTER" style={styles.page}>
        <PdfHeader
          label={data.kind}
          reference={reference}
          generatedAt={generatedAt}
        />

        <Text style={chrome.eyebrow}>Enquiry</Text>
        <Text style={styles.title}>{data.name}</Text>

        <View style={styles.messageCard} wrap={false}>
          <Text style={chrome.cardLabel}>How to reach them</Text>
          <View style={chrome.fieldRow}>
            {contact.map((f) => (
              <Field key={f.label} label={f.label} value={f.value} />
            ))}
          </View>
        </View>

        {extras.length ? (
          <View style={styles.messageCard} wrap={false}>
            <Text style={chrome.cardLabel}>What they told us</Text>
            <View style={chrome.fieldRow}>
              {extras.map((f) => (
                <Field key={f.label} label={f.label} value={f.value} />
              ))}
            </View>
          </View>
        ) : null}

        <View style={styles.messageCard}>
          <Text style={chrome.cardLabel}>Message</Text>
          {message ? (
            <Text style={chrome.bodyText}>{message}</Text>
          ) : (
            <Text style={chrome.emptyText}>No message left</Text>
          )}
        </View>

        <PdfFooter />
      </Page>
    </Document>
  );
}
