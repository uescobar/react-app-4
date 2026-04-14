import { useQuery } from "@tanstack/react-query";
import axios from "axios";

type Todo = {
  id: number;
  title: string;
  completed: string;
  userId: number;
};

const queryTodos = (userId: number | undefined): Promise<Todo[]> => {
  const url = "https://jsonplaceholder.typicode.com/todos";

  return axios.get(url, { params: { userId } }).then((response) => {
    return response.data;
  });
};

function useTodos(userId: number | undefined) {
  // la que sigue es una query local y tiene una configuración en particular y no para todas las queries de la App
  return useQuery({
    // usando un formato tipo url para el queryKey, se pueden pasar parámetros a la función queryFn, en este caso el userId, y así se pueden hacer queries dinámicas, por ejemplo para traer los todos de un usuario específico, con esto se puede hacer una query para cada usuario sin necesidad de crear una función para cada uno, solo cambiando el userId en el queryKey
    //users / 2 / todos
    queryKey: userId ? ["users", userId, "todos"] : ["todos"],
    queryFn: () => queryTodos(userId),
    refetchOnMount: false,
  });
}

export default useTodos;
