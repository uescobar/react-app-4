import {
  keepPreviousData,
  useInfiniteQuery,
  useQuery,
} from "@tanstack/react-query";
import axios, { all } from "axios";

type Todo = {
  id: number;
  title: string;
  completed: string;
  userId: number;
};

const queryTodos = (pageParam: number, pageSize: number): Promise<Todo[]> => {
  const url = "https://jsonplaceholder.typicode.com/todos";

  return axios
    .get(url, {
      params: {
        _start: (pageParam - 1) * pageSize,
        _limit: pageSize,
      },
    })
    .then((response) => {
      return response.data;
    });
};

function useTodos(pageSize: number) {
  // la que sigue es una query local y tiene una configuración en particular y no para todas las queries de la App
  return useInfiniteQuery({
    // usando un formato tipo url para el queryKey, se pueden pasar parámetros a la función queryFn, en este caso el userId, y así se pueden hacer queries dinámicas, por ejemplo para traer los todos de un usuario específico, con esto se puede hacer una query para cada usuario sin necesidad de crear una función para cada uno, solo cambiando el userId en el queryKey
    //users / 2 / todos
    queryKey: ["todos"],
    queryFn: ({ pageParam }) => queryTodos(pageParam, pageSize),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      return lastPage.length > 0 ? allPages.length + 1 : undefined;
    },
  });
}

export default useTodos;
