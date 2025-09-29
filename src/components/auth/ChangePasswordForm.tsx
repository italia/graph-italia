import { useForm } from 'react-hook-form';

import { useState } from 'react';
import * as api from '../../lib/api';

const SERVER_URL = import.meta.env.VITE_SERVER_URL;
function SignUp({ onDone }: { onDone: () => void }) {
  const [message, setMessage] = useState('');
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({});

  const onSubmit = async (submittedData: any) => {
    setMessage('');
    const { password, confirm_password } = submittedData;
    if (password !== confirm_password) {
      setMessage('Passwords do not match');
      return;
    }
    console.log(submittedData);
    console.log(SERVER_URL);
    try {
      const result = await api.changePasssword({ password });
      if (result) {
        onDone();
      } else {
        setMessage('Error while changing password');
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
            Choose a new Password
          </h2>
        </div>

        <div className='mt-10'>
          <div>
            <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
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

              {message && <p className='text-error'>{message}</p>}
              <div>
                <button type='submit' className='btn btn-primary w-full'>
                  Change Password
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignUp;
