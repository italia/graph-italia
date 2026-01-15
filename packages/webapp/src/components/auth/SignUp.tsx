import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import * as api from '../../lib/api';

function SignUp({ setLogin }: { setLogin: (login: boolean) => void }) {
  let navigate = useNavigate();
  const [message, setMessage] = useState('');
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({});

  const onSubmit = async (submittedData: any) => {
    setMessage('');
    const { email, password, confirm_password } = submittedData;
    if (password !== confirm_password) {
      setMessage('Passwords do not match');
      return;
    }
    console.log(submittedData);
    try {
      const result = await api.register({ email, password });
      if (result) {
        navigate('/home');
      } else {
        setMessage('Error while registering');
      }
    } catch (error) {
      console.log('error', error);
      setMessage((error as any).message ?? error);
    }
  };

  return (
    <div className='flex flex-1 flex-col justify-center px-4 py-12 sm:px-6 lg:flex-none lg:px-20 xl:px-24'>
      <div className='mx-auto w-full max-w-sm lg:w-96'>
        <div>
          <h2 className='mt-8 text-2xl font-bold leading-9 tracking-tight text-content'>
            Sign up
          </h2>
        </div>

        <div className='mt-10'>
          <div>
            <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
              <div>
                <label
                  htmlFor='email'
                  className='block text-sm font-medium leading-6'
                >
                  Email address
                </label>
                <div className='mt-2 form-control'>
                  <input
                    id='email'
                    {...register('email', { required: true })}
                    type='email'
                    required
                    autoComplete='email'
                    className='w-full rounded-md'
                  />
                  {errors['email'] && (
                    <p className='text-error'>This field is required</p>
                  )}
                </div>
              </div>

              <div>
                <label
                  htmlFor='password'
                  className='block text-sm font-medium leading-6 text-content'
                >
                  Password
                </label>
                <div className='mt-2'>
                  <input
                    id='password'
                    type='password'
                    required
                    autoComplete='current-password'
                    className='w-full rounded-md'
                    {...register('password', { required: true })}
                  />
                  {errors['password'] && (
                    <p className='text-error'>This field is required</p>
                  )}
                </div>
              </div>

              <div>
                <label
                  htmlFor='confirm-password'
                  className='block text-sm font-medium leading-6 text-content'
                >
                  Confirm Password
                </label>
                <div className='mt-2'>
                  <input
                    id='confirm-password'
                    type='password'
                    required
                    className='w-full rounded-md'
                    {...register('confirm_password', { required: true })}
                  />
                  {errors['confirm_password'] && (
                    <p className='text-error'>This field is required</p>
                  )}
                </div>
              </div>

              <div className='flex items-center'>
                <input
                  id='policy'
                  type='checkbox'
                  className='h-4 w-4 rounded'
                  {...register('policy-acknologment', { required: true })}
                />
                <label
                  htmlFor='policy'
                  className='ml-3 block text-sm leading-6 '
                >
                  I accept the{' '}
                  <a
                    className='link link-primary font-semibold'
                    target='_blank'
                    href='/policy'
                  >
                    policy
                  </a>{' '}
                  agreement.
                </label>
                {errors['policy-acknologment'] && (
                  <p className='pl-4 text-error'>Must accept to register!!</p>
                )}
              </div>

              {message && <p className='text-error'>{message}</p>}
              <div>
                <button type='submit' className='btn btn-primary w-full'>
                  Sign Up
                </button>
              </div>
            </form>
            <div className='text-sm leading-6 my-4'>
              Already have account? &nbsp;
              <button
                onClick={() => setLogin(true)}
                className='link font-semibold text-primary'
              >
                Sign in
              </button>
            </div>
          </div>

          {/* <div className='mt-10'>
            <div className='relative'>
              <div
                aria-hidden='true'
                className='absolute inset-0 flex items-center'
              >
                <div className='w-full border-t border-gray-200' />
              </div>
              <div className='relative flex justify-center text-sm font-medium leading-6'>
                <span className='bg-white px-6'>Or continue with</span>
              </div>
            </div>

            <div className='mt-6  grid grid-cols-2 gap-4'>
              <a href='#' className='btn btn-outline btn-primary w-full'>
                SPID
              </a>
              <a href='#' className='btn btn-outline btn-primary w-full'>
                CIE
              </a>
            </div>
          </div> */}
        </div>
      </div>
    </div>
  );
}

export default SignUp;
