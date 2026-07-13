import React from "react";
import { isPublishingEnabled } from "../../lib/api";

interface EmbedGateProps {
  children: React.ReactNode;
}

/**
 * Guards the /embed/* routes. Embedding only makes sense for a publicly
 * shareable chart/dashboard (it's meant to be dropped into a third-party
 * page's <iframe>, with no login flow available in that context) — so unlike
 * /display/* it can't be turned into an authenticated preview when public
 * publishing is disabled. It's disabled outright instead, with a message
 * explaining the alternative (packages/client / packages/components + API key).
 */
const EmbedGate: React.FC<EmbedGateProps> = ({ children }) => {
  if (isPublishingEnabled()) return <>{children}</>;

  return (
    <div
      role="alert"
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        padding: "2rem",
        textAlign: "center",
        fontFamily: "sans-serif",
      }}
    >
      <p>
        Public embedding is disabled on this instance. Use{" "}
        <code>graph-italia-cli</code> or <code>graph-italia-components</code>{" "}
        with a project API key instead.
      </p>
    </div>
  );
};

export default EmbedGate;
