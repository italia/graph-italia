import { useForm } from 'react-hook-form';
import { useState } from 'react';
import * as api from '../../lib/api';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const SERVER_URL = import.meta.env.VITE_SERVER_URL;

const passwordSchema = z
  .string()
  .min(8, { message: 'Password must be at least 8 characters long' })
  // .max(20, { message: maxLengthErrorMessage })
  .refine((password) => /[A-Z]/.test(password), {
    message: 'Password must have at least one uppercase letter',
  })
  .refine((password) => /[a-z]/.test(password), {
    message: 'Password must have at least one lowercase letter',
  })
  .refine((password) => /[0-9]/.test(password), {
    message: 'Must contain a number',
  })
  .refine((password) => /[!@#$%^&*]/.test(password), {
    message: 'Must contain at least one special character',
  });

export const updatePasswordSchema = z
  .object({
    password: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

function SignUp({ onDone }: { onDone: () => void }) {
  const [message, setMessage] = useState('');
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(updatePasswordSchema),
  });

  const onSubmit = async (submittedData: any) => {
    setMessage('');
    const { password, confirmPassword } = submittedData;
    // if (password !== confirmPassword) {
    //   setmessage('passwords do not match');
    //   return;
    // }
    const isValid = updatePasswordSchema.parse(submittedData);
    console.log('isValid', isValid);

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
                    placeholder='new password'
                    className='w-full rounded-md'
                    {...register('password')}
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
                    className='w-full rounded-md'
                    placeholder=""
                    {...register('confirmPassword')}
                  />
                  {errors['confirmPassword'] && (
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
