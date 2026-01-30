import { useEffect, useMemo, useState } from "react";
import { deleteTask, updateTask } from "../services/api";

/**
 * Modal de detalhes/edição.
 * Permite editar: título, descrição, prioridade, data e status.
 */
export default function TaskDetailsModal({ open, task, onClose, onUpdated, onDeleted }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [priority, setPriority] = useState("MEDIUM");
  const [status, setStatus] = useState("TODO");

  const [touched, setTouched] = useState({ title: false, dueDate: false });
  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (!open || !task) return;
    setTitle(task.title ?? "");
    setDescription(task.description ?? "");
    setDueDate(task.dueDate ?? "");
    setPriority(task.priority ?? "MEDIUM");
    setStatus(task.status ?? "TODO");
    setTouched({ title: false, dueDate: false });
    setSubmitting(false);
    setDeleting(false);
    setErrorMsg("");
  }, [open, task]);

  const errors = useMemo(() => {
    const e = {};
    if (!title.trim()) e.title = "Título é obrigatório.";
    if (!dueDate) e.dueDate = "Data limite é obrigatória.";
    return e;
  }, [title, dueDate]);

  const isValid = Object.keys(errors).length === 0;

  async function handleSave(e) {
    e.preventDefault();
    setTouched({ title: true, dueDate: true });
    setErrorMsg("");
    if (!task?.id) return;
    if (!isValid) return;

    try {
      setSubmitting(true);
      await updateTask(task.id, {
        title: title.trim(),
        description: description.trim() || null,
        dueDate,
        priority,
        status,
      });
      onUpdated?.();
      onClose?.();
    } catch (err) {
      const apiMsg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message ||
        "Não foi possível salvar a tarefa.";
      setErrorMsg(apiMsg);
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete() {
    if (!task?.id) return;
    const ok = window.confirm("Excluir esta tarefa?");
    if (!ok) return;

    try {
      setDeleting(true);
      await deleteTask(task.id);
      onDeleted?.();
      onClose?.();
    } catch (err) {
      const apiMsg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message ||
        "Não foi possível excluir a tarefa.";
      setErrorMsg(apiMsg);
    } finally {
      setDeleting(false);
    }
  }

  if (!open || !task) return null;

  return (
    <div className="modalOverlay" role="dialog" aria-modal="true">
      <div className="modal">
        <div className="modalHeader">
          <h2>Detalhes da Tarefa</h2>
          <button className="iconButton" onClick={onClose} aria-label="Fechar">
            ✕
          </button>
        </div>

        <form onSubmit={handleSave} className="modalBody">
          <label className="field">
            <span>Título *</span>
            <input
              aria-label="Título (editar)"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onBlur={() => setTouched((t) => ({ ...t, title: true }))}
              placeholder="Título"
            />
            {touched.title && errors.title && (
              <span className="fieldError">{errors.title}</span>
            )}
          </label>

          <label className="field">
            <span>Descrição</span>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Descrição (opcional)"
              rows={3}
            />
          </label>

          <div className="fieldRow">
            <label className="field">
              <span>Data limite *</span>
              <input
                aria-label="Data limite (editar)"
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                onBlur={() => setTouched((t) => ({ ...t, dueDate: true }))}
              />
              {touched.dueDate && errors.dueDate && (
                <span className="fieldError">{errors.dueDate}</span>
              )}
            </label>

            <label className="field">
              <span>Prioridade</span>
              <select value={priority} onChange={(e) => setPriority(e.target.value)}>
                <option value="LOW">Baixa</option>
                <option value="MEDIUM">Média</option>
                <option value="HIGH">Alta</option>
              </select>
            </label>
          </div>

          <div className="fieldRow">
            <label className="field">
              <span>Status</span>
              <select value={status} onChange={(e) => setStatus(e.target.value)}>
                <option value="TODO">A Fazer</option>
                <option value="DOING">Em Progresso</option>
                <option value="DONE">Concluído</option>
              </select>
            </label>

            <div className="field">
              <span>ID</span>
              <input value={task.id} readOnly />
            </div>
          </div>

          {errorMsg && <div className="alertError">{errorMsg}</div>}

          <div className="modalFooter between">
            <button
              type="button"
              className="button danger"
              onClick={handleDelete}
              disabled={deleting || submitting}
              title="Excluir tarefa"
            >
              {deleting ? "Excluindo..." : "Excluir"}
            </button>

            <div className="footerRight">
              <button
                type="button"
                className="button secondary"
                onClick={onClose}
                disabled={submitting || deleting}
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="button primary"
                disabled={submitting || deleting || !isValid}
              >
                {submitting ? "Salvando..." : "Salvar"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
