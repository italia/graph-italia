import React, { useState } from 'react';
import FormComponent from './FormComponent';
import { useDrop } from 'react-dnd';

const FormBuilder: React.FC = () => {
    const availableComponents = ['Text Input', 'Dropdown', 'Checkbox', 'Radio'];
    const [droppedComponents, setDroppedComponents] = useState<string[]>([]);

    const [{ isOver }, drop] = useDrop(() => ({
        accept: 'FORM_COMPONENT',
        drop: (item: any) => {
          setDroppedComponents([...droppedComponents, item.type]);
        },
        collect: (monitor) => ({
          isOver: !!monitor.isOver(),
        }),
      }));

  return (
    <div>
      <h2>Form Builder</h2>
      <div
        ref={drop}
        style={{
            border: '2px dashed gray',
            minHeight: '200px',
            padding: '20px',
            backgroundColor: isOver ? 'lightgray' : 'white',
        }}
      >
        {droppedComponents.map((component, index) => (
            <FormComponent key={index} type={component} />
        ))}
      </div>
      <h3>Available Components</h3>
      <div style={{ display: 'flex', gap: '10px' }}>
        {availableComponents.map(component => (
          <FormComponent key={component} type={component} />
        ))}
      </div>
    </div>
  );
};

export default FormBuilder;
