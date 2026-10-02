import type { JsonLdGraph } from '@/lib/seo/structured-data';

/** Server-rendered JSON-LD. `<` is escaped so content can never close the script tag early. */
export default function JsonLd({ data }: { data: JsonLdGraph }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, '\\u003c') }}
    />
  );
}
