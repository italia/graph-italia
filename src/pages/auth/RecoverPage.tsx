import Layout from "../../components/layout";
import RecoverPasswordForm from "../../components/auth/RecoverPwdForm";
import ChangePasswordForm from "../../components/auth/ChangePasswordForm";

function AuthPage({ action = "recover" }) {
  return (
    <Layout>
      <div className='flex min-h-full'>
        <>
          {action === "recover" ? (
            <RecoverPasswordForm onDone={() => console.log("done")} />
          ) : (
            <ChangePasswordForm onDone={() => console.log("done")} />
          )}
        </>
      </div>
    </Layout>
  );
}

export default AuthPage;
