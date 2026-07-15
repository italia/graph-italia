import { useState } from "react";
import { useTranslation } from "react-i18next";
import SignIn from "../../components/auth/SignIn";
import SignUp from "../../components/auth/SignUp";
import Layout from "../../components/layout";

function AuthPage() {
  const [login, setLogin] = useState(true);
  const [welcome, showWelcome] = useState(false);
  const { t } = useTranslation("pages", { keyPrefix: "auth" });

  return (
    <Layout>
      <div className="flex flex-col  min-h-full justify-center items-center  px-4 sm:px-6 lg:px-8">
        {welcome && (
          <>
            <div role="alert" className="alert alert-success mt-6 mb-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 shrink-0 stroke-current"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <p className="text-lg">{t("header.accountCreated.label")} </p>
            </div>
            <div role="alert" className="alert alert-info mb-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 shrink-0 stroke-current"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <p className="text-lg">{t("header.checkEmail.label")}</p>
            </div>
          </>
        )}
        <>
          {login ? (
            <SignIn setLogin={setLogin} />
          ) : (
            <SignUp
              setLogin={setLogin}
              handleRegistered={() => showWelcome(true)}
            />
          )}
        </>
        {/* <div
          className={`relative hidden w-0 flex-1 lg:block bg-cover  bg-center bg-no-repeat ${
            login
              ? "bg-[url('/images/undraw_Charts_re_5qe9.png')]"
              : "bg-[url('/images/undraw_Data_re_80ws.png')]"
          } `}
        >
          <div className='py-20 w-full h-full bg-primary opacity-90 text-primary-content flex flex-col items-center  justify-center '>
            {login ? (
              <>
                <h1 className='text-6xl'>Welcome Back.</h1>
                <p className='py-10 text-3xl'>we missed you!</p>
              </>
            ) : (
              <>
                <h1 className='text-6xl'>Create an account.</h1>
                <p className='py-10 text-3xl'>Join the community.</p>
              </>
            )}
          </div>
        </div> */}
      </div>
    </Layout>
  );
}

export default AuthPage;
