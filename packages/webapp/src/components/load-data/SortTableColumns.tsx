import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd";
import type { DropResult } from "@hello-pangea/dnd";

type SortTableColumnsProps = {
  columnOrder: string[];
  onReorder: (newOrder: string[]) => void;
};

export default function SortTableColumns({
  columnOrder,
  onReorder,
}: SortTableColumnsProps) {
  function handleDragEnd(result: DropResult) {
    if (!result.destination || result.destination.index === result.source.index) return;
    const next = [...columnOrder];
    const [moved] = next.splice(result.source.index, 1);
    next.splice(result.destination.index, 0, moved);
    onReorder(next);
  }

  return (
    <div className="mt-4 p-4 rounded-lg border border-base-300 bg-base-200">
      <h4 className="text-sm font-semibold mb-3">Reorder Columns</h4>
      <p className="text-xs text-base-content/50 mb-3">
        Drag the handles to reorder columns.
      </p>
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="column-order" direction="horizontal">
          {(provided) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className="flex flex-wrap gap-2"
            >
              {columnOrder.map((colName, index) => (
                <Draggable key={colName} draggableId={colName} index={index}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs border cursor-grab select-none transition-colors ${
                        snapshot.isDragging
                          ? "bg-primary text-primary-content border-primary shadow-lg"
                          : "bg-base-100 border-base-300 text-base-content hover:border-primary/50 hover:text-primary"
                      }`}
                    >
                      <svg
                        className="w-3 h-3 opacity-50 shrink-0"
                        viewBox="0 0 16 16"
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        <circle cx="5" cy="4" r="1.2" />
                        <circle cx="11" cy="4" r="1.2" />
                        <circle cx="5" cy="8" r="1.2" />
                        <circle cx="11" cy="8" r="1.2" />
                        <circle cx="5" cy="12" r="1.2" />
                        <circle cx="11" cy="12" r="1.2" />
                      </svg>
                      {colName}
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
}
