import React from "react";

export default function ScrollButton({
  side,
  onClick,
  ariaLabel,
  visible = false,
}: {
  side: "left" | "right";
  onClick: () => void;
  ariaLabel: string;
  visible?: boolean;
}) {
  const isLeft = side === "left";
  const classNames = `mid-scroll-btn ${isLeft ? "mid-scroll-btn--left" : "mid-scroll-btn--right"} ${visible ? "is-visible" : ""}`;
  return (
    <button
      type='button'
      className={classNames}
      aria-label={ariaLabel}
      onClick={onClick}
    >
      {isLeft ? (
        <svg width='18' height='18' viewBox='0 0 24 24' aria-hidden='true'>
          <path fill='currentColor' d='M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z' />
        </svg>
      ) : (
        <svg width='18' height='18' viewBox='0 0 24 24' aria-hidden='true'>
          <path fill='currentColor' d='M8.59 16.59L10 18l6-6-6-6-1.41 1.41L13.17 12z' />
        </svg>
      )}
    </button>
  );
}


