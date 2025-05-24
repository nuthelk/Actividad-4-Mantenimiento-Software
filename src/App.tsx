import { useState, useEffect } from "react";

interface Task {
  id: string;
  text: string;
  completed: boolean;
  priority: "Alta" | "Media" | "Baja";
}

const getInitialTasks = (): Task[] => {
  const data = localStorage.getItem("tasks");
  return data ? JSON.parse(data) : [];
};

function App() {
  const [tasks, setTasks] = useState<Task[]>(getInitialTasks);
  const [filter, setFilter] = useState<string>("Todas");
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [showForm, setShowForm] = useState<boolean>(false);

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  const handleAddOrEditTask = (task: {
    id?: string;
    text: string;
    priority: "Alta" | "Media" | "Baja";
  }) => {
    if (task.id) {
      setTasks((prev) =>
        prev.map((t) =>
          t.id === task.id
            ? { ...t, text: task.text, priority: task.priority }
            : t
        )
      );
    } else {
      setTasks((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          text: task.text,
          completed: false,
          priority: task.priority,
        },
      ]);
    }
    setEditingTask(null);
    setShowForm(false);
  };

  const handleEdit = (id: string) => {
    const t = tasks.find((task) => task.id === id);
    if (t) {
      setEditingTask(t);
      setShowForm(true);
    }
  };

  const handleToggle = (id: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  };

  const handleDelete = (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  const handleCancel = () => {
    setEditingTask(null);
    setShowForm(false);
  };

  const handleClearCompleted = () => {
    setTasks((prev) => prev.filter((t) => !t.completed));
  };

  const pendingCount = tasks.filter((t) => !t.completed).length;

  return (
    <main className="max-w-xl mx-auto p-4 min-h-full bg-gray-100">
      <h1 className="text-3xl font-extrabold mb-6 text-center text-blue-700 drop-shadow-lg">
        Lista de Tareas
      </h1>
      <div className="flex flex-col sm:flex-row items-center justify-between mb-6 gap-4">
        <span className="text-base bg-blue-50 px-4 py-2 rounded-full shadow text-blue-700 font-semibold">
          Pendientes:{" "}
          <span className="font-bold text-blue-900">{pendingCount}</span>
        </span>
        <div className="flex gap-2">
          <button
            onClick={() => setFilter("Todas")}
            className={`flex items-center gap-1 px-4 py-2 rounded-full shadow transition-colors duration-150 font-semibold border-2 ${
              filter === "Todas"
                ? "bg-blue-500 text-white border-blue-500"
                : "bg-white text-blue-500 border-blue-300 hover:bg-blue-50"
            }`}
          >
            <span>📋</span> Todas
          </button>
          <button
            onClick={() => setFilter("Pendientes")}
            className={`flex items-center gap-1 px-4 py-2 rounded-full shadow transition-colors duration-150 font-semibold border-2 ${
              filter === "Pendientes"
                ? "bg-yellow-400 text-white border-yellow-400"
                : "bg-white text-yellow-500 border-yellow-300 hover:bg-yellow-50"
            }`}
          >
            <span>⏳</span> Pendientes
          </button>
          <button
            onClick={() => setFilter("Completadas")}
            className={`flex items-center gap-1 px-4 py-2 rounded-full shadow transition-colors duration-150 font-semibold border-2 ${
              filter === "Completadas"
                ? "bg-green-500 text-white border-green-500"
                : "bg-white text-green-500 border-green-300 hover:bg-green-50"
            }`}
          >
            <span>✅</span> Completadas
          </button>
        </div>
        <button
          onClick={handleClearCompleted}
          className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-full shadow font-semibold transition-colors duration-150 border-2 border-red-500 hover:border-red-600"
        >
          🧹 Limpiar Completadas
        </button>
      </div>
    </main>
  );
}

export default App;
