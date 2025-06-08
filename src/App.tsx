import { useState, useEffect } from "react";
import TaskList from "./TaskList";
import TaskForm from "./TaskForm";
// Importamos las funciones de nuestra nueva API
import * as api from "./api";

interface Task {
  id: string;
  text: string;
  completed: boolean;
  priority: "Alta" | "Media" | "Baja";
}

// Eliminamos la función getInitialTasks() que usaba localStorage directamente

function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filter, setFilter] = useState<string>("Todas");
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [showForm, setShowForm] = useState<boolean>(false);

  // NUEVOS ESTADOS para manejar carga y errores
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // NUEVO: Carga inicial de datos desde la API
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setError(null);
        setIsLoading(true);
        const fetchedTasks = await api.getTasks();
        setTasks(fetchedTasks);
      } catch (err) {
        setError("Error al cargar las tareas.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchTasks();
  }, []); // El array vacío asegura que se ejecute solo una vez al montar

  // MODIFICADO: La función ahora es asíncrona y usa la API
  const handleAddOrEditTask = async (task: {
    id?: string;
    text: string;
    priority: "Alta" | "Media" | "Baja";
  }) => {
    setIsLoading(true);
    setError(null);
    try {
      if (task.id) {
        // Editar
        const updatedTask = await api.updateTask(task.id, {
          text: task.text,
          priority: task.priority,
        });
        setTasks((prev) =>
          prev.map((t) => (t.id === task.id ? updatedTask : t))
        );
      } else {
        // Agregar
        const newTask = await api.addTask({
          text: task.text,
          priority: task.priority,
        });
        setTasks((prev) => [...prev, newTask]);
      }
      setShowForm(false);
      setEditingTask(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ocurrió un error.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (id: string) => {
    const t = tasks.find((task) => task.id === id);
    if (t) {
      setEditingTask(t);
      setShowForm(true);
    }
  };

  // MODIFICADO: La función ahora es asíncrona
  const handleToggle = async (id: string) => {
    const task = tasks.find((t) => t.id === id);
    if (!task) return;

    setIsLoading(true);
    setError(null);
    try {
      const updatedTask = await api.updateTask(id, {
        completed: !task.completed,
      });
      setTasks((prev) => prev.map((t) => (t.id === id ? updatedTask : t)));
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "No se pudo actualizar el estado."
      );
    } finally {
      setIsLoading(false);
    }
  };

  // MODIFICADO: La función ahora es asíncrona
  const handleDelete = async (id: string) => {
    setIsLoading(true);
    setError(null);
    try {
      await api.deleteTask(id);
      setTasks((prev) => prev.filter((t) => t.id !== id));
    } catch (err) {
      setError("No se pudo eliminar la tarea.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setEditingTask(null);
    setShowForm(false);
  };

  // MODIFICADO: La función ahora es asíncrona
  const handleClearCompleted = async () => {
    const completedTasks = tasks.filter((t) => t.completed);
    if (completedTasks.length === 0) return;

    setIsLoading(true);
    setError(null);
    try {
      // Borramos cada tarea completada en paralelo
      await Promise.all(completedTasks.map((t) => api.deleteTask(t.id)));
      setTasks((prev) => prev.filter((t) => !t.completed));
    } catch (err) {
      setError("No se pudieron limpiar las tareas completadas.");
    } finally {
      setIsLoading(false);
    }
  };

  const pendingCount = tasks.filter((t) => !t.completed).length;

  return (
    <main className="max-w-xl mx-auto p-4 min-h-full bg-gray-100">
      <h1 className="text-3xl font-extrabold mb-6 text-center text-blue-700 drop-shadow-lg">
        Lista de Tareas
      </h1>

      {/* NUEVO: UI para mostrar errores */}
      {error && (
        <div
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative mb-4"
          role="alert"
        >
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      )}

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
      {showForm ? (
        <TaskForm
          onSave={handleAddOrEditTask}
          onCancel={handleCancel}
          editingTask={
            editingTask
              ? {
                  id: editingTask.id,
                  text: editingTask.text,
                  priority: editingTask.priority,
                }
              : undefined
          }
        />
      ) : (
        <button
          onClick={() => {
            setEditingTask(null);
            setShowForm(true);
          }}
          className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-full shadow font-bold text-lg mb-6 transition-colors duration-150 border-2 border-green-500 hover:border-green-600"
        >
          <span>➕</span> Agregar Tarea
        </button>
      )}
      {/* NUEVO: UI para mostrar estado de carga */}
      {isLoading ? (
        <div className="text-center p-4 font-semibold">Cargando tareas...</div>
      ) : (
        <TaskList
          tasks={tasks}
          onEdit={handleEdit}
          onToggle={handleToggle}
          onDelete={handleDelete}
          filter={filter}
        />
      )}
    </main>
  );
}

export default App;
