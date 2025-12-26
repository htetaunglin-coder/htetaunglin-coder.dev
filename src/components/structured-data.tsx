export function StructuredData({ data }: { data: object }) {
  return (
    <script
      // biome-ignore lint/security/noDangerouslySetInnerHtml: for seo structured data
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data),
      }}
      type="application/ld+json"
    />
  );
}
