export default function TaskCard({ task, onClick }) {
  return (
    <div
      className={`card ${task.priority?.toLowerCase()}`}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      onClick={onClick}
    >
      <strong>{task.title}</strong>
      {task.description ? <p>{task.description}</p> : null}
    </div>
  );
}
