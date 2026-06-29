import {
  FaAngleLeft,
  FaAngleRight,
  FaAnglesLeft,
  FaAnglesRight,
} from "react-icons/fa6";

/**
 * Consistent pagination icon set for `react-data-table-component`.
 *
 * The library default mixes a chevron with a filled arrow inside the same
 * control, which the accessibility audit flagged as visually redundant
 * (WCAG 1.3.1). Using a single shape (chevron, doubled for first/last)
 * removes the ambiguity.
 */
export const paginationIcons = {
  paginationIconPrevious: <FaAngleLeft aria-hidden="true" />,
  paginationIconNext: <FaAngleRight aria-hidden="true" />,
  paginationIconFirstPage: <FaAnglesLeft aria-hidden="true" />,
  paginationIconLastPage: <FaAnglesRight aria-hidden="true" />,
};
