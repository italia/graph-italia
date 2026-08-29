import React, { useEffect, useRef } from 'react';

interface ConfirmDialog {
  title: string;
  message: string;
  children: React.PropsWithChildren;
  toggle: boolean;
  confirmCb: () => void;
  cancelCb: () => void;
}

export default function ConfirmDialog({
  title,
  message,
  children,
  toggle,
  confirmCb,
  cancelCb,
}: any) {
  const ref = useRef<HTMLDialogElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (ref.current) {
      if (toggle) {
        ref.current.showModal();
        // Land the initial focus on the title, not on the first button, so the
        // screen reader announces the modal context first (WCAG 2.4.3).
        requestAnimationFrame(() => titleRef.current?.focus());
      } else {
        ref.current.close();
      }
    }
  }, [toggle, ref, children]);

  return (
    <dialog ref={ref} className='modal'>
      <div className='modal-box'>
        <h3 ref={titleRef} tabIndex={-1} className='font-bold text-lg outline-none'>{title}</h3>
        <div>{message}</div>
        <div className='modal-action'>
          <button className='btn btn-outline' onClick={() => cancelCb()}>
            No
          </button>
          <button className='btn btn-primary' onClick={() => confirmCb()}>
            Yes
          </button>
        </div>
      </div>
    </dialog>
  );
}
