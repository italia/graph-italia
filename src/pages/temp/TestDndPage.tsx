import React from "react";
import FormBuilder from "../../drag-n-drop/FormBuilder";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

const TestGridPage: React.FC = () => {
  return (
    <div>
      <h1>Test Grid Page</h1>
      <DndProvider backend={HTML5Backend}>
        <FormBuilder />
      </DndProvider>
    </div>
  );
};

export default TestGridPage;
