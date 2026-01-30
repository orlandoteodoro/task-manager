import { useEffect, useMemo, useState } from "react";
import { DragDropContext } from "@hello-pangea/dnd";
import { getTasks, updateTaskStatus } from "../services/api";
import KanbanColumn from "../components/KanbanColumn";
import TaskModal from "../components/TaskModal";
import TaskDetailsModal from "../components/TaskDetailsModal";

export default function Board() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  const groupedCounts = useMemo(() => {
    const counts = { TODO: 0, DOING: 0, DONE: 0 };
    for (const t of tasks) counts[t.status] = (counts[t.status] || 0) + 1;
    return counts;
  }, [tasks]);

  async function loadTasks() {
    try {
      setErrorMsg("");
      setLoading(true);
      const res = await getTasks();
      setTasks(res.data || []);
    } catch (err) {
      const apiMsg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message ||
        "Não foi possível carregar as tarefas.";
      setErrorMsg(apiMsg);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadTasks();
  }, []);

  async function handleDragEnd(result) {
    const { destination, source, draggableId } = result;
    if (!destination) return;

    const from = source.droppableId;
    const to = destination.droppableId;

    // Sem mudança real
    if (from === to && destination.index === source.index) return;

    // Otimista: atualiza UI imediatamente
    setTasks((prev) => {
      const copy = [...prev];
      const idx = copy.findIndex((t) => String(t.id) === String(draggableId));
      if (idx === -1) return prev;
      copy[idx] = { ...copy[idx], status: to };
      return copy;
    });

    // Persistência no backend apenas se mudou coluna/status
    if (from !== to) {
      try {
        await updateTaskStatus(draggableId, to);
      } catch (err) {
        // Reverte e mostra erro
        setErrorMsg(
          err?.response?.data?.message ||
            err?.response?.data?.error ||
            "Não foi possível mover a tarefa. Tentando recarregar..."
        );
        await loadTasks();
      }
    }
  }

  return (
    <div>
      <header className="topbar">
        <div className="brand">
          <img className="appLogo" src="/logo.png" alt="Logo" />
        </div>

        <button className="button primary" onClick={() => setModalOpen(true)}>
          Nova Tarefa +
        </button>
      </header>

      {loading && <div className="pageInfo">Carregando...</div>}
      {errorMsg && (
        <div className="pageError">
          {errorMsg}{" "}
          <button className="linkButton" onClick={loadTasks}>
            Tentar novamente
          </button>
        </div>
      )}

      {!loading && !errorMsg && (
        <DragDropContext onDragEnd={handleDragEnd}>
          <div className="board">
            <KanbanColumn title="A Fazer" status="TODO" tasks={tasks} onTaskClick={(t) => { setSelectedTask(t); setDetailsOpen(true); }} />
            <KanbanColumn title="Em Progresso" status="DOING" tasks={tasks} onTaskClick={(t) => { setSelectedTask(t); setDetailsOpen(true); }} />
            <KanbanColumn title="Concluído" status="DONE" tasks={tasks} onTaskClick={(t) => { setSelectedTask(t); setDetailsOpen(true); }} />
          </div>
        </DragDropContext>
      )}

      <TaskModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onCreated={loadTasks}
      />

      <TaskDetailsModal
        open={detailsOpen}
        task={selectedTask}
        onClose={() => setDetailsOpen(false)}
        onUpdated={loadTasks}
        onDeleted={loadTasks}
      />
    </div>
  );
}
