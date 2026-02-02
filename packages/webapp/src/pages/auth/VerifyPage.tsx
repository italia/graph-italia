import { useEffect, useState } from 'react';
import VerifyCode from '../../components/auth/VerifyCode';
import Layout from '../../components/layout';
import { useParams } from 'react-router-dom';
import { activate } from '../../lib/api';
import { useNavigate } from 'react-router-dom';
import ChangePasswordForm from '../../components/auth/ChangePasswordForm';
import { HOME_ROUTE } from '../../router';

function AuthPage() {
  const { uid } = useParams();
  const [isValid, setResult] = useState(false);
  const [action, setAction] = useState('init');
  const [code, setCode] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    let action = searchParams.get('action');
    let code = searchParams.get("code");
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
    navigate('/recover-password');
  }

  async function handleResult(result: boolean) {
    setResult(result);
    try {
      if (action === 'init') {
        await activate();
        redirectHome();
      }
    } catch (e) {
      console.error(e);
    }
  }

  if (!uid) return (<Layout>
    <div className='flex min-h-full justify-center items-center  px-4 sm:px-6 lg:px-8'>
      <div className='text-sm leading-6'>
        <p>Invalid params, use the recover password flow to get a new code.</p>
        <a
          href='#'
          onClick={() => handleAskAnotherCode()}
          className='link font-semibold link-primary'
        >
          Recover password
        </a>
      </div>
    </div>
  </Layout>);

  return (
    <Layout>
      <div className='flex min-h-full justify-center items-center  px-4 sm:px-6 lg:px-8'>
        <div>
          {!(isValid && action) && (
            <VerifyCode
              uid={uid}
              code={code}
              onCheckDone={(result: boolean) => handleResult(result)}
              onAskAnotherCode={() => handleAskAnotherCode()}
            />
          )}
          {isValid && <div role="alert" className="alert alert-success">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 shrink-0 stroke-current" fill="none" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span> The code is Valid.</span>
          </div>
          }
          {isValid && action === 'reset' && (
            <div>
              <ChangePasswordForm onDone={() => redirectHome()} />
            </div>
          )}
          {isValid && action === 'init' && (
            <div>
              <p>You can now close this window or
                <a href={HOME_ROUTE} className='link font-semibold link-primary'>enter</a>
              </p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}

export default AuthPage;
