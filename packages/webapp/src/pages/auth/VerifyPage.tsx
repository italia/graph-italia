import { useEffect, useState } from 'react';
import VerifyCode from '../../components/auth/VerifyCode';
import Layout from '../../components/layout';
import { useParams } from 'react-router-dom';
import { activate } from '../../lib/api';
import { useNavigate } from 'react-router-dom';
import ChangePasswordForm from '../../components/auth/ChangePasswordForm';

function AuthPage() {
  const { uid } = useParams();
  const [isValid, setResult] = useState(false);
  const [action, setAction] = useState('init');
  const navigate = useNavigate();

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    // let code = searchParams.get("code");
    let action = searchParams.get('action');
    if (action) {
      setAction(action);
    }
  }, []);

  async function handleResult(result: boolean) {
    setResult(result);
    try {
      if (action === 'init') {
        await activate();
        navigate('/home');
      }
    } catch (e) {
      console.error(e);
    }
  }

  function redirectHome() {
    // alert('changed');
    navigate('/home');
  }

  function handleAskAnotherCode() {
    navigate('/recover-password');
  }

  if (!uid) return <div>Error</div>;

  return (
    <Layout>
      <div className='flex min-h-full justify-center items-center  px-4 sm:px-6 lg:px-8'>
        <div>
          {!(isValid && action) && (
            <VerifyCode
              uid={uid}
              onCheckDone={(result: boolean) => handleResult(result)}
              onAskAnotherCode={() => handleAskAnotherCode()}
            />
          )}
          {isValid && <div>The code is Valid.</div>}
          {isValid && action === 'reset' && (
            <div>
              <ChangePasswordForm onDone={() => redirectHome()} />
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}

export default AuthPage;
