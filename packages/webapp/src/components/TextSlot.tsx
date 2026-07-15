import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

/**
 * Renders the markdown content of a dashboard text slot.
 *
 * Headings are shifted one level down (# → h2, ## → h3, …) so a published
 * dashboard keeps its single page-level <h1> and a correct heading hierarchy
 * for assistive technologies. Colors are driven by DaisyUI theme variables so
 * the block stays readable in both the "italia" and "scuro" themes.
 */
const HEADING_SHIFT = {
  h1: "h2",
  h2: "h3",
  h3: "h4",
  h4: "h5",
  h5: "h6",
  h6: "h6",
} as const;

function TextSlot({ content }: { content: string }) {
  return (
    <div className="h-full overflow-y-auto p-6 prose max-w-none [--tw-prose-body:var(--color-base-content)] [--tw-prose-headings:var(--color-base-content)] [--tw-prose-bold:var(--color-base-content)] [--tw-prose-links:var(--color-primary)] [--tw-prose-bullets:var(--color-base-content)] [--tw-prose-counters:var(--color-base-content)] [--tw-prose-quotes:var(--color-base-content)] [--tw-prose-code:var(--color-base-content)]">
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={HEADING_SHIFT}>
        {content}
      </ReactMarkdown>
    </div>
  );
}

export default TextSlot;
