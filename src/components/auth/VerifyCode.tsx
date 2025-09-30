import { useState, useEffect } from 'react';
import { PinInput } from 'react-input-pin-code';

import * as api from '../../lib/api';
import { useUserStore } from '../../store/user_store';

export default function VerifyCodeComponent({
  uid = '',
  onCheckDone,
  onAskAnotherCode,
}: {
  uid: string;
  onCheckDone: (result: boolean) => void;
  onAskAnotherCode: () => void;
}) {
  const [values, setValues] = useState(['', '', '', '', '', '']);
  const { setUser } = useUserStore();
  const [showState, setShowState] = useState<boolean | undefined>(false);

  async function handleCheck(value: string) {
    if (!value) {
      return;
    }
    try {
      const result = await api.verify({ uid, code: value });
      console.log('verify result', result);
      setShowState(true);
      const user = await api.getUser();
      console.log(user);
      setUser(user);
      return onCheckDone(result);
    } catch (error) {
      console.log('error', error);
    }
  }

  useEffect(() => {
    if (values.length === 6 && values.every((v) => v !== '')) {
      const value = values.join('');
      console.log('value', value);
      handleCheck(value);
    }
  }, [values]);

  return (
    <div className='flex flex-1 flex-col justify-center px-4 py-12 sm:px-6 lg:flex-none lg:px-20 xl:px-24'>
      <div className='mx-auto w-full max-w-sm lg:w-96'>
        <div>
          <h2 className='mt-8 text-2xl font-bold leading-9 tracking-tight text-content'>
            Verification code
          </h2>
          <p>insert your verification code in the input below</p>
        </div>

        <div className='mt-10'>
          <div>
            <PinInput
              values={values}
              onChange={(value, index, values) => setValues(values)}
              showState={showState}
            />

            <div className='text-sm leading-6 my-4'>
              Resend code? &nbsp;
              <button
                onClick={() => onAskAnotherCode()}
                className='link font-semibold text-primary'
              >
                send another code
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
