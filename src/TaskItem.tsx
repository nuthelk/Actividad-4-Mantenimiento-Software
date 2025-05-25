import React, { useState } from "react";
import { FaEdit, FaTrash, FaSave, FaTimes } from "react-icons/fa";

interface Task {
  id: string;
  text: string;
  completed: boolean;
  priority: "Alta" | "Media" | "Baja";
}

interface TaskItemProps {
  task: Task;
  onEdit: (
    id: string,
    text: string,
    priority: "Alta" | "Media" | "Baja"
  ) => void;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

const priorityColors = {
  Alta: "text-red-600",
  Media: "text-yellow-600",
  Baja: "text-green-600",
};

const TaskItem: React.FC<TaskItemProps> = ({
  task,
  onEdit,
  onToggle,
  onDelete,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(task.text);
  const [editPriority, setEditPriority] = useState<Task["priority"]>(
    task.priority
  );

  const handleSave = () => {
    if (editText.trim() !== "") {
      onEdit(task.id, editText, editPriority);
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setEditText(task.text);
    setEditPriority(task.priority);
    setIsEditing(false);
  };

  return (
    <li className="flex items-center justify-between bg-white p-2 rounded shadow mb-2">
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={task.completed}
          onChange={() => onToggle(task.id)}
          className="accent-blue-500"
        />
        {isEditing ? (
          <>
            <input
              type="text"
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              className="border p-1 rounded"
              autoFocus
            />
            <select
              value={editPriority}
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              onChange={(e) => setEditPriority(e.target.value as any)}
              className="border p-1 rounded"
            >
              <option value="Alta">Alta</option>
              <option value="Media">Media</option>
              <option value="Baja">Baja</option>
            </select>
          </>
        ) : (
          <>
            <span
              className={task.completed ? "line-through text-gray-400" : ""}
            >
              {task.text}
            </span>
            <span
              className={`ml-2 text-xs font-bold ${
                priorityColors[task.priority]
              }`}
            >
              {task.priority}
            </span>
          </>
        )}
      </div>
      <div className="flex gap-2">
        {isEditing ? (
          <>
            <button
              onClick={handleSave}
              className="text-green-600 hover:underline flex items-center gap-1"
            >
              <FaSave /> Guardar
            </button>
            <button
              onClick={handleCancel}
              className="text-gray-500 hover:underline flex items-center gap-1"
            >
              <FaTimes /> Cancelar
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => setIsEditing(true)}
              className="text-blue-500 hover:underline flex items-center gap-1"
            >
              <FaEdit /> Editar
            </button>
            <button
              onClick={() => onDelete(task.id)}
              className="text-red-500 hover:underline flex items-center gap-1"
            >
              <FaTrash /> Eliminar
            </button>
          </>
        )}
      </div>
    </li>
  );
};

export default TaskItem;
