import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import * as api from '../../lib/api';
import { AxiosError } from 'axios';
import { z } from "zod";

const passwordSchema = z
  .string()
  .min(8, { message: "Password must be at least 8 characters long" })
  // .max(20, { message: maxLengthErrorMessage })
  .refine((password) => /[A-Z]/.test(password), {
    message: "Password must have at least one uppercase letter",
  })
  .refine((password) => /[a-z]/.test(password), {
    message: "Password must have at least one lowercase letter",
  })
  .refine((password) => /[0-9]/.test(password), {
    message: "Must contain a number",
  })
  .refine((password) => /[!@#$%^&*]/.test(password), {
    message: "Must contain at least one special character",
  });

export const signupSchema = z
  .object({
    email: z.string().email({ message: "Invalid email address" }),
    password: passwordSchema,
    confirmPassword: passwordSchema,
    policyAcknologment: z.boolean().refine((val) => val === true, {
      message: "You must accept the policy agreement",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

function SignUp({ setLogin, handleRegistered }: { setLogin: (login: boolean) => void, handleRegistered: () => void, }) {
  let navigate = useNavigate();
  const [message, setMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({ resolver: zodResolver(signupSchema), });

  const onSubmit = async (submittedData: any) => {
    setMessage('');

    const isValid = signupSchema.parse(submittedData);
    console.log("isValid", isValid);

    console.log(submittedData);
    try {
      const { email, password } = submittedData;
      const result = await api.register({ email, password });
      console.log('Registration result', result);
      if (result?.uid) {
        // const path = `/verify/${result.uid}?action=init`;
        // navigate(path);
        handleRegistered();

      } else {
        setMessage('Error while registering');
      }
    } catch (error) {
      console.log('error', error);
      const errorMessage = ((error as AxiosError).response?.data as any).error?.message || (error as any).message || error;
      setMessage(errorMessage);
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
                  htmlFor="password"
                  className="block text-sm font-medium leading-6 text-content"
                >
                  Password
                </label>
                <div className="mt-2">
                  <div className="relative">
                    <input
                      id="hs-toggle-password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter a new password"
                      className="w-full rounded-md block"
                      {...register("password")}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 end-0 flex items-center z-20 px-3 cursor-pointer text-content rounded-e-md focus:text-primary"
                    >
                      <svg
                        className="shrink-0 size-3.5"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      >
                        <path
                          className={"block"}
                          d="M9.88 9.88a3 3 0 1 0 4.24 4.24"
                        ></path>
                        <path
                          className={"block"}
                          d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"
                        ></path>
                        <path
                          className={"block"}
                          d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"
                        ></path>
                        <line
                          className={showPassword ? "hidden" : "block"}
                          x1="2"
                          x2="22"
                          y1="2"
                          y2="22"
                        ></line>
                        <path
                          className={"block"}
                          d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"
                        ></path>
                        <circle
                          className={"block"}
                          cx="12"
                          cy="12"
                          r="3"
                        ></circle>
                      </svg>
                    </button>
                  </div>
                  {/* <input
                    id='password'
                    type='password'
                    placeholder='new password'
                    className='w-full rounded-md'
                    {...register('password')}
                  /> */}
                  {errors["password"] && (
                    <p className="text-error">{errors["password"].message}</p>
                  )}
                </div>
              </div>

              <div>
                <label
                  htmlFor="confirm-password"
                  className="block text-sm font-medium leading-6 text-content"
                >
                  Confirm Password
                </label>
                <div className="mt-2">
                  <input
                    id="confirm-password"
                    type="password"
                    className="w-full rounded-md"
                    placeholder=""
                    {...register("confirmPassword")}
                  />
                  {errors["confirmPassword"] && (
                    <p className="text-error">
                      {errors["confirmPassword"].message}
                    </p>
                  )}
                </div>
              </div>

              <div className='flex items-center'>
                <input
                  id='policy'
                  type='checkbox'
                  className='h-4 w-4 rounded'
                  {...register('policyAcknologment', { required: true })}
                />
                <label
                  htmlFor='policy'
                  className='ml-3 block text-sm leading-6 '
                >
                  I accept the{' '}
                  <a
                    className='link link-primary font-semibold'
                    target='_blank'
                    href='/gdpr'
                  >
                    privacy policy
                  </a>{' '}
                  agreement.
                  <hr />
                  <small>Privacy at a Glance: We value your data. Dataviz uses only one strictly necessary, server-side cookie for authentication. We do not use third-party cookies, trackers, or analytics. We only store your email address to manage your account and keep your charts saved. Your data stays yours.</small>
                </label>
                {errors['policyAcknologment'] && (
                  <p className='pl-4 text-error'>{errors['policyAcknologment'].message}</p>
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
