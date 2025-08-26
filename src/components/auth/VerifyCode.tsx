import { useState } from "react";
import * as api from "../../lib/api";
import VerificationInput from "react-verification-input";

function VerifyCode({
  uid = "",
  onCheckDone,
}: {
  uid: string;
  onCheckDone: (result: boolean) => void;
}) {
  const [value, setValue] = useState("");

  async function handleCheck() {
    if (!value) {
      return;
    }
    try {
      const result = await api.verify({ uid, code: value });
      return onCheckDone(result);
    } catch (error) {
      console.log("error", error);
    }
  }

  function handleComplete() {
    setTimeout(() => {
      handleCheck();
    }, 1000);
  }
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
            <VerificationInput
              onChange={(e) => setValue(e)}
              onComplete={() => handleComplete()}
              value={value}
            />

            <div className='text-sm leading-6 my-4'>
              Resend code? &nbsp;
              <button
                onClick={() => console.log(".")}
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

export default VerifyCode;
