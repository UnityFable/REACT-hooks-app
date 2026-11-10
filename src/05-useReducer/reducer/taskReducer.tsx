import * as z from 'zod';

interface Todo {
  id: number;
  text: string;
  completed: boolean;
}

interface TaskState {
  todos: Todo[];
  length: number;
  completedNo: number;
  pendingNo: number;
}

export type TaskAction =
  | { type: 'ADD_TODO'; payload: string; }
  | { type: 'TOOGLE_TODO'; payload: number; }
  | { type: 'DELETE_TODO'; payload: number; };

const TodoSchema = z.object({
  id: z.number(),
  text: z.string(),
  completed: z.boolean(),
});

const TaskStateSchema = z.object({
  todos: z.array(TodoSchema),
  length: z.number(),
  completedNo: z.number(),
  pendingNo: z.number(),
});

export const getTasksInitialState = (): TaskState => {
  const localStorageState = localStorage.getItem('tasks-state');
  if (!localStorageState) {
    return {
      todos: [],
      length: 0,
      completedNo: 0,
      pendingNo: 0,
    };
  }

  const result = TaskStateSchema.safeParse(JSON.parse(localStorageState));

  if (result.error) {
    console.error(result.error);
    return {
      todos: [],
      length: 0,
      completedNo: 0,
      pendingNo: 0,
    };
  }

  //! El objeto pudo haber sido modificado
  return result.data;
};

export const taskReducer = (state: TaskState, action: TaskAction): TaskState => {
  switch (action.type) {
    case 'ADD_TODO': {
      const newTodo: Todo = {
        id: Date.now(),
        text: action.payload.trim(),
        completed: false
      };

      return {
        ...state,
        todos: [...state.todos, newTodo],
        length: state.todos.length + 1,
        pendingNo: state.pendingNo + 1,
      };
    }
    case 'TOOGLE_TODO': {
      const updatedTodos = state.todos.map(todo => {
        if (todo.id === action.payload) {
          return { ...todo, completed: !todo.completed };
        }
        return todo;
      });
      return {
        ...state,
        todos: updatedTodos,
        completedNo: updatedTodos.filter(todo => todo.completed).length,
        pendingNo: updatedTodos.filter(todo => !todo.completed).length,
      };
    }
    case 'DELETE_TODO': {
      const updatedTodos = state.todos.filter(todo => todo.id !== action.payload);
      return {
        ...state,
        todos: updatedTodos,
        length: updatedTodos.length,
        completedNo: updatedTodos.filter(todo => todo.completed).length,
        pendingNo: updatedTodos.filter(todo => !todo.completed).length
      };
    }

    default:
      return state;
  }
};