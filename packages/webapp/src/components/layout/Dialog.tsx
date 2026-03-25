import { useEffect, useRef } from "react";
export default function Dialog({ title, children, toggle, callback }: any) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    if (ref.current) {
      if (toggle) {
        ref.current.showModal();
      } else {
        ref.current.close();
      }
    }
  }, [toggle, ref, children]);

  return (
    <dialog ref={ref} className="modal">
      <div className="modal-box max-w-6xl max-h-full">
        <h2 className="font-bold text-lg ">{title}</h2>
        <div className="mx-auto">
          {children}
        </div>
        <div className="modal-action">
          <button className="btn btn-primary" onClick={() => callback()}>
            Close
          </button>
        </div>
      </div>
    </dialog>
  );
}
