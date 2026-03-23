import { useNavigate } from "react-router-dom";
import ChangePasswordForm from "../../components/auth/ChangePasswordForm";
import RecoverPasswordForm from "../../components/auth/RecoverPwdForm";
import Layout from "../../components/layout";
import { HOME_ROUTE } from "../../router";
import { useUserStore } from "../../lib/store/user_store";

function AuthPage({ action: _action = "recover" }: { action?: string }) {
  const { user } = useUserStore();
  const navigate = useNavigate();

  function redirectHome() {
    navigate(HOME_ROUTE);
  }

  return (
    <Layout>
      <div className="flex min-h-full justify-center items-center  px-4 sm:px-6 lg:px-8">
        <>
          {user /*&& action != 'recover'*/ ? (
            <ChangePasswordForm onDone={() => redirectHome()} />
          ) : (
            <RecoverPasswordForm onDone={() => console.log("done")} />
          )}
        </>
      </div>
    </Layout>
  );
}

export default AuthPage;
