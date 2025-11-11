import React from 'react';
import { useDrag } from 'react-dnd';

interface FormComponentProps {
  type: string;
}

const FormComponent: React.FC<FormComponentProps> = ({ type }) => {
    const [{ isDragging }, drag] = useDrag(() => ({
        type: 'FORM_COMPONENT',
        item: { type },
        collect: (monitor) => ({
          isDragging: !!monitor.isDragging(),
        }),
      }));

  return (
    <div
        ref={drag}
        style={{
            border: '1px solid black',
            padding: '10px',
            margin: '5px',
            display: 'inline-block',
            cursor: 'grab',
            opacity: isDragging ? 0.5 : 1,
        }}
    >
      {type}
    </div>
  );
};

export default FormComponent;
