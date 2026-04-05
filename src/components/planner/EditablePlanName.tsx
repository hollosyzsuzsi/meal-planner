import { useState, useRef, useEffect } from 'react';
import { EditIcon, TrashIcon } from '../ui/Icons';
import { type EditablePlanNameProps } from '../../types/props';

export function EditablePlanName({ name, onRename, onDelete }: EditablePlanNameProps) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(name);
  const [saving, setSaving] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setDraft(name);
  }, [name]);

  useEffect(() => {
    if (editing) inputRef.current?.select();
  }, [editing]);

  const handleSave = async () => {
    const trimmed = draft.trim();
    if (!trimmed || trimmed === name) {
      setEditing(false);
      setDraft(name);
      return;
    }
    try {
      setSaving(true);
      await onRename(trimmed);
      setEditing(false);
    } finally {
      setSaving(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSave();
    if (e.key === 'Escape') {
      setEditing(false);
      setDraft(name);
    }
  };

  const handleDelete = async () => {
    if (!confirmDelete) {
      setConfirmDelete(true);
      return;
    }
    await onDelete();
    setConfirmDelete(false);
  };

  if (editing) {
    return (
      <div className="editable-name editable-name--editing">
        <input
          ref={inputRef}
          className="editable-name__input"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={handleSave}
          disabled={saving}
          maxLength={80}
        />
        <span className="editable-name__hint">Enter to save, Esc to cancel</span>
      </div>
    );
  }

  return (
    <div className="editable-name">
      <h1 className="editable-name__title">{name}</h1>
      <button
        className="btn-icon btn-icon--sm"
        onClick={() => setEditing(true)}
        title="Rename plan"
      >
        <EditIcon />
      </button>
      {confirmDelete ? (
        <div className="editable-name__confirm">
          <span>Delete this plan?</span>
          <button className="btn btn--danger btn--sm" onClick={handleDelete}>
            Yes, delete
          </button>
          <button
            className="btn btn--ghost btn--sm"
            onClick={() => setConfirmDelete(false)}
          >
            Cancel
          </button>
        </div>
      ) : (
        <button
          className="btn-icon btn-icon--sm btn-icon--danger"
          onClick={handleDelete}
          title="Delete plan"
        >
          <TrashIcon />
        </button>
      )}
    </div>
  );
}