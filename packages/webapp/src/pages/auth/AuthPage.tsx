import { useState } from "react";
import SignIn from "../../components/auth/SignIn";
import SignUp from "../../components/auth/SignUp";
import Layout from "../../components/layout";

function AuthPage() {
  const [login, setLogin] = useState(true);
  return (
    <Layout>
      <div className='flex min-h-full flex-1'>
        <>
          {login ? (
            <SignIn setLogin={setLogin} />
          ) : (
            <SignUp setLogin={setLogin} />
          )}
        </>
        <div
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
        </div>
      </div>
    </Layout>
  );
}

export default AuthPage;
