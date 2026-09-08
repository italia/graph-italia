import hotToast, { type Renderable, type ToastOptions } from "react-hot-toast";

/**
 * react-hot-toast renders every toast as role="status" / aria-live="polite",
 * and the per-toast defaults win over the <Toaster> options. A polite region
 * created together with its content is not reliably announced, so error
 * toasts were seen but not heard (#135, WCAG 4.1.3 and 3.3.1). Through this
 * wrapper `toast.error` becomes role="alert", announced on insertion, and
 * stays a little longer so it can be read back.
 */
const ERROR_OPTIONS: ToastOptions = {
  duration: 6000,
  ariaProps: { role: "alert", "aria-live": "assertive" },
};

const toast = Object.assign(
  (message: Renderable, options?: ToastOptions) => hotToast(message, options),
  hotToast,
  {
    error: (message: Renderable, options?: ToastOptions) =>
      hotToast.error(message, { ...ERROR_OPTIONS, ...options }),
  },
);

export default toast;
