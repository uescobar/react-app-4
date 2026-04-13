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
  return useQuery({
    queryKey: ["todos"],
    queryFn: queryTodos,
  });
}

export default useTodos;
