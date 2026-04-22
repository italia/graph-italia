import { useEffect, useState } from "react";
import { PinInput } from "react-input-pin-code";

import { AxiosError } from "axios";
import { useTranslation } from "react-i18next";
import * as api from "../../lib/api";
import { useUserStore } from "../../lib/store/user_store";

export default function VerifyCodeComponent({
  uid = "",
  onCheckDone,
  onAskAnotherCode,
  code = "",
}: {
  uid: string;
  onCheckDone: (result: boolean) => void;
  onAskAnotherCode: () => void;
  code?: string;
}) {
  const { t } = useTranslation("components", {
    keyPrefix: "components.auth.verifyCode",
  });

  useEffect(() => {
    if (code && code.length === 6) {
      setTimeout(() => {
        setValues(code.split(""));
      }, 1000);
    }
  }, [code]);

  const [values, setValues] = useState(["", "", "", "", "", ""]);
  const [message, setMessage] = useState("");
  const { setUser } = useUserStore();
  const [showState, setShowState] = useState<boolean>(false);

  async function handleCheck(value: string) {
    if (!value) {
      return;
    }
    setMessage("");
    try {
      const result = await api.verify({ uid, code: value });
      setShowState(true);
      const user = await api.getUser();
      console.log(user);
      setUser(user);
      return onCheckDone(result);
    } catch (error) {
      console.log("error", error);
      // setMessage('Error code invalid or expired');
      const errorMessage =
        ((error as AxiosError).response?.data as any).error?.message ||
        (error as any).message ||
        error;
      setMessage(errorMessage);
    }
  }

  useEffect(() => {
    if (values.length === 6 && values.every((v) => v !== "")) {
      const value = values.join("");
      console.log("value", value);
      handleCheck(value);
    }
  }, [values]);

  return (
    <div className="flex flex-1 flex-col justify-center px-4 py-12 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
      <div className="mx-auto w-full  min-w-sm max-w-lg card bg-base-100 shadow-sm border border-base-200">
        <div className="card-body p-8">
          <div>
            <h1 className="text-2xl font-bold leading-9 tracking-tight text-content">
              {t(`header.label`)}
            </h1>
            <p> {t(`header.description`)}</p>
          </div>

          <div className="mt-10">
            <div>
              <PinInput
                values={values}
                onChange={(_, __, values) => setValues(values)}
                showState={showState}
              />
              {message && (
                <div className="text-error mt-2 text-md">{message}</div>
              )}
              <div className="text-sm leading-6 my-4">
                {t(`bottom.label`)}
                &nbsp;
                <button
                  type="button"
                  onClick={() => onAskAnotherCode()}
                  className="link font-semibold text-primary"
                >
                  {t(`bottom.actions.sendAnotherCode.label`)}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
