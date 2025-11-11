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
    <dialog ref={ref} className='modal'>
      <div className='modal-box'>
        <h3 className='font-bold text-lg'>{title}</h3>
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
