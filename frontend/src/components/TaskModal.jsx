import { useEffect, useMemo, useState } from "react";
import { createTask } from "../services/api";

/**
 * Modal simples para criar tarefa.
 * Validação (requisito): não permitir criar sem título ou data.
 */
export default function TaskModal({ open, onClose, onCreated }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [priority, setPriority] = useState("MEDIUM");

  const [touched, setTouched] = useState({ title: false, dueDate: false });
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (!open) return;
    // reset ao abrir
    setTitle("");
    setDescription("");
    setDueDate("");
    setPriority("MEDIUM");
    setTouched({ title: false, dueDate: false });
    setSubmitting(false);
    setErrorMsg("");
  }, [open]);

  const errors = useMemo(() => {
    const e = {};
    if (!title.trim()) e.title = "Título é obrigatório.";
    if (!dueDate) e.dueDate = "Data limite é obrigatória.";
    return e;
  }, [title, dueDate]);

  const isValid = Object.keys(errors).length === 0;

  async function handleSubmit(e) {
    e.preventDefault();
    setTouched({ title: true, dueDate: true });
    setErrorMsg("");

    if (!isValid) return;

    try {
      setSubmitting(true);
      await createTask({
        title: title.trim(),
        description: description.trim() || null,
        dueDate, // LocalDate esperado: YYYY-MM-DD
        priority,
      });
      onCreated?.();
      onClose?.();
    } catch (err) {
      const apiMsg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message ||
        "Não foi possível criar a tarefa.";
      setErrorMsg(apiMsg);
    } finally {
      setSubmitting(false);
    }
  }

  if (!open) return null;

  return (
    <div className="modalOverlay" role="dialog" aria-modal="true">
      <div className="modal">
        <div className="modalHeader">
          <h2>Nova Tarefa</h2>
          <button className="iconButton" onClick={onClose} aria-label="Fechar">
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modalBody">
          <label className="field">
            <span>Título *</span>
            <input aria-label="Título *"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onBlur={() => setTouched((t) => ({ ...t, title: true }))}
              placeholder="Ex: Nova Tarefa"
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
              placeholder="Detalhes da tarefa (opcional)"
              rows={3}
            />
          </label>

          <div className="fieldRow">
            <label className="field">
              <span>Data limite *</span>
              <input aria-label="Data limite *"
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
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
              >
                <option value="LOW">Baixa</option>
                <option value="MEDIUM">Média</option>
                <option value="HIGH">Alta</option>
              </select>
            </label>
          </div>

          {errorMsg && <div className="alertError">{errorMsg}</div>}

          <div className="modalFooter">
            <button
              type="button"
              className="button secondary"
              onClick={onClose}
              disabled={submitting}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="button primary"
              disabled={submitting || !isValid}
            >
              {submitting ? "Salvando..." : "Criar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
