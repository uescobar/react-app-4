import { useQuery } from "@tanstack/react-query";

type Todo = {
  id: number;
  title: string;
  completed: string;
  userId: number;
};

const queryTodos = (): Promise<Todo[]> =>
  fetch("https://jsonplaceholder.typicode.com/todos").then((response) => {
    if (!response.ok) {
      throw new Error(`Error ${response.status}`);
    }
    return response.json();
  });

function useTodos() {
  // la que sigue es una query local y tiene una configuración en particular y no para todas las queries de la App
  return useQuery({
    queryKey: ["todos"],
    queryFn: queryTodos,
    refetchOnMount: false,
  });
}

export default useTodos;
