import dayjs from 'dayjs';
import type { FieldDataType } from '../types';

type DashboardListProps = {
  list: FieldDataType[] | [];
  handleEditDashboard: (item: FieldDataType) => void;
  handleDeleteDashboard: (id: string) => void;
  handleViewDashboard: (id: string) => void;
};

export default function DashboardList({
  list,
  handleDeleteDashboard,
  handleEditDashboard,
  handleViewDashboard,
}: DashboardListProps) {
  return (
    <div>
      {list?.map((item) => {
        const createdAt = (item as any).createddAt || '';
        const updatedAt = (item as any).updatedAt || '';
        return (
          <div
            key={item.id}
            className='my-2 flex gap-2 items-center border p-2'
          >
            <div className='grow flex flex-col'>
              <div className='text-lg'>{item.name}</div>
              {createdAt && (
                <small className={`text-xxs text-content opacity-70 pr-4`}>
                  {dayjs(createdAt).format('DD/MM/YYYY HH:mm')}
                </small>
              )}
              {updatedAt && (
                <small className={`text-xxs text-content opacity-70 pr-4`}>
                  {dayjs(updatedAt).format('DD/MM/YYYY HH:mm')}
                </small>
              )}
            </div>
            <button
              className='btn btn-outline btn-success btn-sm'
              onClick={() => handleViewDashboard(item.id ?? '')}
            >
              VIEW
            </button>
            <button
              className='btn btn-outline btn-primary btn-sm'
              onClick={() => handleEditDashboard(item)}
            >
              EDIT
            </button>
            <button
              className='btn btn-outline btn-error btn-sm'
              onClick={() => handleDeleteDashboard(item.id || '')}
            >
              DELETE
            </button>
          </div>
        );
      })}
    </div>
  );
}
