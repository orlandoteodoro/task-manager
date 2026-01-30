import { Droppable, Draggable } from "@hello-pangea/dnd";
import TaskCard from "./TaskCard";

export default function KanbanColumn({ title, status, tasks, onTaskClick }) {
  const columnTasks = tasks.filter((t) => t.status === status);

  return (
    <div className="column">
      <div className="columnHeader">
        <h3>{title}</h3>
        <span className="pill">{columnTasks.length}</span>
      </div>

      <Droppable droppableId={status}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`droppable ${snapshot.isDraggingOver ? "dragOver" : ""}`}
          >
            {columnTasks.map((task, index) => (
              <Draggable key={task.id} draggableId={String(task.id)} index={index}>
                {(dragProvided, dragSnapshot) => (
                  <div
                    ref={dragProvided.innerRef}
                    {...dragProvided.draggableProps}
                    {...dragProvided.dragHandleProps}
                    className={dragSnapshot.isDragging ? "dragging" : ""}
                  >
                    <TaskCard
                      task={task}
                      onClick={onTaskClick ? () => onTaskClick(task) : undefined}
                    />
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
}
