import { useNavigate } from 'react-router-dom';
import Layout from '../../components/layout';
import RecoverPasswordForm from '../../components/auth/RecoverPwdForm';
import ChangePasswordForm from '../../components/auth/ChangePasswordForm';

function AuthPage({ action = 'recover' }) {
  const navigate = useNavigate();

  function redirectHome() {
    alert('changed');
    navigate('/home');
  }

  return (
    <Layout>
      <div className='flex min-h-full'>
        <>
          {action === 'recover' ? (
            <RecoverPasswordForm onDone={() => console.log('done')} />
          ) : (
            <ChangePasswordForm onDone={() => redirectHome()} />
          )}
        </>
      </div>
    </Layout>
  );
}

export default AuthPage;
