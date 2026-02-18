export default function Footer() {
  return (
    <footer className="footer bg-secondary text-secondary-content p-4">
      <aside>
        <p>
          <span className="text-lg font-bold">Dataviz</span>:{" "}
          <em>share your charts</em>
        </p>
      </aside>
      <nav className="grid-flow-col gap-4 md:place-self-center md:justify-self-end">
        <a href="/quickstart" className="underline">
          Quick start
        </a>
        <a href="/terms-of-service" className="underline">
          Terms of Service
        </a>
        <a href="/gdpr" className="underline">
          Privacy Policy
        </a>
      </nav>
    </footer>
  );
}
