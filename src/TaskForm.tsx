import React, { useState, useEffect, useRef } from "react";
import {
  FaChevronDown,
  FaChevronUp,
  FaStar,
  FaPlus,
  FaSave,
  FaTimes,
  FaCircle,
} from "react-icons/fa";

interface TaskFormProps {
  onSave: (task: {
    id?: string;
    text: string;
    priority: "Alta" | "Media" | "Baja";
  }) => void;
  onCancel: () => void;
  editingTask?: {
    id: string;
    text: string;
    priority: "Alta" | "Media" | "Baja";
  } | null;
}

const TaskForm: React.FC<TaskFormProps> = ({
  onSave,
  onCancel,
  editingTask,
}) => {
  const [text, setText] = useState("");
  const [priority, setPriority] = useState<"Alta" | "Media" | "Baja">("Media");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (editingTask) {
      setText(editingTask.text);
      setPriority(editingTask.priority);
    } else {
      setText("");
      setPriority("Media");
    }
  }, [editingTask]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim() === "") return;
    onSave({ id: editingTask?.id, text, priority });
    setText("");
    setPriority("Media");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-4 bg-white p-6 rounded-2xl shadow-xl mb-6 border border-blue-100"
    >
      <div className="flex flex-col gap-2">
        <label className="text-blue-700 font-semibold text-sm flex items-center gap-2">
          <span>📝</span> Descripción
        </label>
        <input
          type="text"
          placeholder="Descripción de la tarea"
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="border-2 border-blue-200 focus:border-blue-400 p-3 rounded-lg text-base shadow-sm transition-all"
          autoFocus
        />
      </div>
      <div className="flex flex-col gap-2">
        <label className="text-blue-700 font-semibold text-sm flex items-center gap-2">
          <FaStar className="text-yellow-500" /> Prioridad
        </label>
        <div className="relative" ref={dropdownRef}>
          <button
            type="button"
            className={`w-full flex items-center justify-between border-2 border-yellow-200 focus:border-yellow-400 p-3 pr-10 rounded-lg text-base shadow-sm transition-all bg-yellow-50 font-bold text-yellow-700 appearance-none relative ${
              dropdownOpen ? "ring-2 ring-yellow-300" : ""
            }`}
            onClick={() => setDropdownOpen((open) => !open)}
            aria-haspopup="listbox"
            aria-expanded={dropdownOpen}
          >
            <span className="flex items-center gap-2">
              {priority === "Alta" && <FaCircle className="text-red-500" />}
              {priority === "Media" && <FaCircle className="text-yellow-400" />}
              {priority === "Baja" && <FaCircle className="text-green-500" />}
              {priority}
            </span>
            {dropdownOpen ? (
              <FaChevronUp className="text-yellow-500 text-xl" />
            ) : (
              <FaChevronDown className="text-yellow-500 text-xl" />
            )}
          </button>
          {dropdownOpen && (
            <ul
              className="absolute z-10 left-0 w-full mt-2 bg-white border border-yellow-200 rounded-lg shadow-lg animate-fadeIn"
              role="listbox"
            >
              <li
                className="flex items-center gap-2 px-4 py-2 cursor-pointer hover:bg-yellow-100 transition-colors font-bold text-red-600"
                onClick={() => {
                  setPriority("Alta");
                  setDropdownOpen(false);
                }}
                role="option"
                aria-selected={priority === "Alta"}
              >
                <FaCircle className="text-red-500" /> Alta
              </li>
              <li
                className="flex items-center gap-2 px-4 py-2 cursor-pointer hover:bg-yellow-100 transition-colors font-bold text-yellow-600"
                onClick={() => {
                  setPriority("Media");
                  setDropdownOpen(false);
                }}
                role="option"
                aria-selected={priority === "Media"}
              >
                <FaCircle className="text-yellow-400" /> Media
              </li>
              <li
                className="flex items-center gap-2 px-4 py-2 cursor-pointer hover:bg-yellow-100 transition-colors font-bold text-green-600"
                onClick={() => {
                  setPriority("Baja");
                  setDropdownOpen(false);
                }}
                role="option"
                aria-selected={priority === "Baja"}
              >
                <FaCircle className="text-green-500" /> Baja
              </li>
            </ul>
          )}
        </div>
      </div>
      <div className="flex gap-3 justify-end mt-2">
        <button
          type="submit"
          className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-full shadow font-bold text-base transition-colors duration-150 border-2 border-blue-500 hover:border-blue-600"
        >
          {editingTask ? <FaSave /> : <FaPlus />}{" "}
          {editingTask ? "Guardar" : "Agregar"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="flex items-center gap-2 bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-2 rounded-full shadow font-semibold text-base border-2 border-gray-300 hover:border-gray-400"
        >
          <FaTimes /> Cancelar
        </button>
      </div>
    </form>
  );
};

export default TaskForm;
