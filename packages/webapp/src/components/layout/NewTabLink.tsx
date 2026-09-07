import { useTranslation } from "react-i18next";
import { FaArrowUpRightFromSquare } from "react-icons/fa6";

/**
 * Link that opens in a new tab and says so, both visually (icon) and to
 * assistive tech (visually-hidden suffix in the accessible name), as the
 * change of browsing context must be announced before activation (#131).
 */
export default function NewTabLink({
  href,
  className,
  children,
}: {
  href: string;
  className?: string;
  children: React.ReactNode;
}) {
  const { t } = useTranslation("components", { keyPrefix: "components.common" });
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
      {children}
      <FaArrowUpRightFromSquare aria-hidden="true" className="ml-2 inline-block size-3.5 align-[-0.1em]" />
      <span className="sr-only"> {t("newTab", "(si apre in una nuova scheda)")}</span>
    </a>
  );
}
