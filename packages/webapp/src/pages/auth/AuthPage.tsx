import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router-dom";
import SignIn from "../../components/auth/SignIn";
import SignUp from "../../components/auth/SignUp";
import Layout from "../../components/layout";

function AuthPage() {
  const [searchParams] = useSearchParams();
  const [login, setLogin] = useState(searchParams.get("mode") !== "register");
  const [registered, setRegistered] = useState(false);
  const { t } = useTranslation("pages", { keyPrefix: "auth" });
  const registeredHeading = useRef<HTMLHeadingElement>(null);

  // After a successful sign-up the form is replaced by a confirmation panel
  // (#70): the message sits at the top of the page, the heading receives
  // focus so it is announced, and the next step is a single clear CTA.
  useEffect(() => {
    if (registered) {
      window.scrollTo({ top: 0 });
      registeredHeading.current?.focus();
    }
  }, [registered]);

  return (
    <Layout>
      <div className="flex flex-col  min-h-full justify-center items-center  px-4 sm:px-6 lg:px-8">
        {registered ? (
          <section
            aria-labelledby="registered-heading"
            className="my-12 mx-auto w-full max-w-lg card bg-base-100 shadow-sm border border-base-200"
          >
            <div className="card-body p-8">
              <h1
                id="registered-heading"
                ref={registeredHeading}
                tabIndex={-1}
                className="text-2xl font-bold leading-9 tracking-tight text-content outline-none"
              >
                {t("registered.title")}
              </h1>
              <p role="status" className="mt-4">
                {t("registered.body")}
              </p>
              <p className="mt-6">
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => {
                    setRegistered(false);
                    setLogin(true);
                  }}
                >
                  {t("registered.cta")}
                </button>
              </p>
            </div>
          </section>
        ) : login ? (
          <SignIn setLogin={setLogin} />
        ) : (
          <SignUp setLogin={setLogin} handleRegistered={() => setRegistered(true)} />
        )}
      </div>
    </Layout>
  );
}

export default AuthPage;
