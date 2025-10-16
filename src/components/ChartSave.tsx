// import * as R from "ramda";
import dayjs from 'dayjs';
import { useForm } from 'react-hook-form';
import * as api from '../lib/api';

function ChartSave({ item, handleSave }: any) {
  const defaultName = `${item.chart}chart-${dayjs(Date.now()).format(
    'YYYY-MM-DD_HH-mm'
  )}`;
  // const generatedId = nanoid();

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty, isSubmitting, touchedFields, submitCount },
  } = useForm({
    defaultValues: {
      id: item?.id || '',
      name: item?.name || defaultName,

      description: item?.description || '',
      publish: item?.id ? item?.publish : true,
    },
  });

  function saveChart(formData: any) {
    const { id = '', name, description = '', publish = false } = formData;
    console.log('Save chart id', item);
    // const itemData = R.omit(["id"], item);
    const payload = {
      name,
      description,
      publish,
      chart: item.chart || 'bar',
      config: item.config,
      data: item.data,
      isRemote: item.isRemote,
      remoteUrl: item.remoteUrl,
      // preview: item.preview,
    };
    console.log('Save chart', payload);
    return api.upsertChart(payload, id);
  }

  const onSubmit = async (formData: any) => {
    const result = await saveChart(formData);
    console.log('onSubmit', result);
    if (result) {
      handleSave();
    }
  };

  if (!item.chart) {
    return <div className='my-5'>Please choose a item.chart type</div>;
  }
  console.log('errors', errors);
  return (
    <div className='my-5 bg-base-200 p-4 rounded-box'>
      {item.preview && <img width='150' src={item.preview} />}
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <input type='hidden' {...register('id', { required: false })} />
          <div className='form-control'>
            <label className='label'>Chart name</label>
            <input
              type='text'
              className='input w-full'
              placeholder='Chart name'
              // value={`${chart}chart-${dayjs(Date.now()).format(
              //   'YYYY-MM-DD_HH-mm'
              // )}`}
              {...register('name', { required: true })}
            />
            {errors['name'] && (
              <span className='text-danger'>This field is required</span>
            )}
          </div>
          <div className='form-control'>
            <label className='label'>Description</label>
            <input
              type='text'
              {...register('description', { required: false })}
              className='textarea w-full'
              placeholder='Description'
            />
          </div>
          <div className='my-3'>
            <div className='flex items-center '>
              <input
                id='remember-me'
                type='checkbox'
                className='h-4 w-4 rounded'
                {...register('publish', { required: false })}
              />
              <label
                htmlFor='remember-me'
                className='ml-3 block text-sm leading-6 '
              >
                Publish
              </label>
            </div>
          </div>

          {isSubmitting && (
            <div className='loading loading-lg'>...sumbitting</div>
          )}
          <button
            disabled={isSubmitting}
            type='submit'
            className='btn btn-primary full my-3'
          >
            Save
          </button>
        </div>
      </form>
    </div>
  );
}

export default ChartSave;
