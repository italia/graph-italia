import { useEffect, useState } from "react";
import { Trans, useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import ResetPasswordForm from "../../components/auth/ResetPasswordForm";
import VerifyCode from "../../components/auth/VerifyCode";
import Layout from "../../components/layout";
import { HOME_ROUTE } from "../../router";

function AuthPage() {
  const { t } = useTranslation("pages", { keyPrefix: "verify" });
  const { uid } = useParams();
  const [isValid, setResult] = useState(false);
  const [action, setAction] = useState("");
  const [code, setCode] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const action = searchParams.get("action");
    const code = searchParams.get("code");
    if (action) {
      setAction(action);
    }
    if (code) {
      setCode(code);
    }
  }, []);

  function redirectHome() {
    navigate(HOME_ROUTE);
  }

  function handleAskAnotherCode() {
    navigate("/recover-password");
  }

  async function handleResult(result: boolean) {
    setResult(result);
    if (result) {
      redirectHome();
    }
  }

  if (!uid)
    return (
      <Layout>
        <div className="flex min-h-full justify-center items-center  px-4 sm:px-6 lg:px-8">
          <div className="text-sm leading-6">
            <p>{t(`body.errors.invalidParam.label`)}</p>
            <button
              type="button"
              onClick={() => handleAskAnotherCode()}
              className="link font-semibold link-primary"
            >
              {t(`body.errors.invalidParam.actions.recoverPassword.label`)}
            </button>
          </div>
        </div>
      </Layout>
    );

  // Password reset flow: collect code + new password in one step, calling POST /auth/reset-password
  if (action === "reset") {
    return (
      <Layout>
        <div className="flex min-h-full justify-center items-center px-4 sm:px-6 lg:px-8">
          <ResetPasswordForm
            uid={uid}
            code={code}
            onDone={() => redirectHome()}
          />
        </div>
      </Layout>
    );
  }

  // Registration activation flow: verify the PIN via POST /auth/verify, then redirect home
  return (
    <Layout>
      <div className="flex min-h-full justify-center items-center  px-4 sm:px-6 lg:px-8">
        <div>
          {!isValid && (
            <VerifyCode
              uid={uid}
              code={code}
              onCheckDone={(result: boolean) => handleResult(result)}
              onAskAnotherCode={() => handleAskAnotherCode()}
            />
          )}
          {isValid && action !== "reset" && (
            <div role="alert" className="alert alert-success">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 shrink-0 stroke-current"
                fill="none"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span>
                <p>{t(`body.messages.valid`)}</p>
              </span>
            </div>
          )}
          {isValid && (
            <div>
              <p>
                <Trans
                  i18nKey={`body.actions.init.label`}
                  components={{
                    redirectLink: (
                      <a
                        href={HOME_ROUTE}
                        className="link font-semibold link-primary"
                      >home</a>
                    ),
                  }}
                />
              </p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}

export default AuthPage;
