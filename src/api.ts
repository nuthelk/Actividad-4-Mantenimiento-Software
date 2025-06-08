// NUEVO ARCHIVO: src/api.ts

// Definimos la interfaz Task para reutilizarla
interface Task {
  id: string;
  text: string;
  completed: boolean;
  priority: "Alta" | "Media" | "Baja";
}

// Inicializamos el "backend" con datos de localStorage si existen, o un array vacío
let tasks: Task[] = JSON.parse(localStorage.getItem("tasks") || "[]");

const saveTasks = () => {
  localStorage.setItem("tasks", JSON.stringify(tasks));
};

// Simulamos la latencia de la red
const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

// --- Funciones de la API ---

export const getTasks = async (): Promise<Task[]> => {
  await delay(500); // Simula 0.5s de carga
  console.log("API: Obteniendo tareas");
  return [...tasks];
};

export const addTask = async (taskData: { text: string; priority: "Alta" | "Media" | "Baja" }): Promise<Task> => {
  await delay(300);
  const newTask: Task = {
    ...taskData,
    id: crypto.randomUUID(),
    completed: false,
  };
  tasks.push(newTask);
  saveTasks();
  console.log("API: Tarea agregada", newTask);
  return newTask;
};

export const updateTask = async (id: string, updates: Partial<Task>): Promise<Task> => {
  await delay(300);
  // Simular un posible error
  if (Math.random() > 0.8) {
      console.error("API: Error simulado al actualizar");
      throw new Error("No se pudo actualizar la tarea. Inténtelo de nuevo.");
  }
  
  let updatedTask: Task | undefined;
  tasks = tasks.map(task => {
    if (task.id === id) {
      updatedTask = { ...task, ...updates };
      return updatedTask;
    }
    return task;
  });

  if (!updatedTask) throw new Error("Tarea no encontrada");
  
  saveTasks();
  console.log("API: Tarea actualizada", updatedTask);
  return updatedTask;
};

export const deleteTask = async (id: string): Promise<void> => {
  await delay(300);
  tasks = tasks.filter(task => task.id !== id);
  saveTasks();
  console.log("API: Tarea eliminada", id);
};