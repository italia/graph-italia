import { useForm } from "react-hook-form";
import { useState } from "react";
import * as api from "../../lib/api";
import { AxiosError } from "axios";

function RecoverPasswordForm({ onDone }: { onDone: () => void }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({});
  const [message, setMessage] = useState("");

  const onSubmit = async (submittedData: any) => {
    setMessage("");
    const { email } = submittedData;
    try {
      const result = await api.recoverPasssword(email);
      console.log("result", result);
      if (!result) {
        setMessage("Error while recovering password");
        return;
      }
      setMessage("Check Your Email");
      setTimeout(() => {
        onDone();
      }, 1000);
    } catch (error) {
      console.error("Error:", error);
      const errorMessage = (error as AxiosError).response?.data?.error?.message || (error as any).message || error;
      setMessage(errorMessage);
    }
  };

  return (
    <div className='flex flex-1 flex-col justify-center px-4 py-12 sm:px-6 lg:flex-none lg:px-20 xl:px-24'>
      <div className='mx-auto w-full max-w-sm lg:w-96'>
        <div>
          <h2 className='mt-8 text-2xl font-bold leading-9 tracking-tight text-content'>
            Insert your email
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
                    type='email'
                    required
                    autoComplete='email'
                    className='w-full rounded-md'
                    {...register("email", { required: true })}
                  />
                  {errors["email"] && (
                    <span className='text-error'>This field is required</span>
                  )}
                </div>
              </div>
              {message && <p className='text-error'>{message}</p>}
              <div>
                <button type='submit' className='btn btn-primary w-full'>
                  Recover Password
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RecoverPasswordForm;
