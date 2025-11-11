import { useNavigate } from 'react-router-dom';
import Layout from '../../components/layout';
import RecoverPasswordForm from '../../components/auth/RecoverPwdForm';
import ChangePasswordForm from '../../components/auth/ChangePasswordForm';
import { useUserStore } from '../../store/user_store';

function AuthPage({ action = 'recover' }) {
  const { user } = useUserStore();
  const navigate = useNavigate();

  function redirectHome() {
    // alert('changed'); todo use a toast
    navigate('/home');
  }

  return (
    <Layout>
      <div className='flex min-h-full'>
        <>
          {user /*&& action != 'recover'*/ ? (
            <ChangePasswordForm onDone={() => redirectHome()} />
          ) : (
            <RecoverPasswordForm onDone={() => console.log('done')} />
          )}
        </>
      </div>
    </Layout>
  );
}

export default AuthPage;
