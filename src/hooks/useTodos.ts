import { keepPreviousData, useQuery } from "@tanstack/react-query";
import axios from "axios";

type Todo = {
  id: number;
  title: string;
  completed: string;
  userId: number;
};

type TodoQuery = {
  page: number;
  pageSize: number;
};

const queryTodos = (query: TodoQuery): Promise<Todo[]> => {
  const url = "https://jsonplaceholder.typicode.com/todos";

  return axios
    .get(url, {
      params: {
        _start: (query.page - 1) * query.pageSize,
        _limit: query.pageSize,
      },
    })
    .then((response) => {
      return response.data;
    });
};

function useTodos(query: TodoQuery) {
  // la que sigue es una query local y tiene una configuración en particular y no para todas las queries de la App
  return useQuery({
    // usando un formato tipo url para el queryKey, se pueden pasar parámetros a la función queryFn, en este caso el userId, y así se pueden hacer queries dinámicas, por ejemplo para traer los todos de un usuario específico, con esto se puede hacer una query para cada usuario sin necesidad de crear una función para cada uno, solo cambiando el userId en el queryKey
    //users / 2 / todos
    queryKey: ["todos", query],
    queryFn: () => queryTodos(query),
    placeholderData: keepPreviousData, // esto hace que mientras se carga la nueva data, se mantenga la data anterior, en lugar de mostrar un estado de carga vacío, esto es útil para paginación o para filtros, para evitar que se muestre un estado de carga vacío cada vez que se cambia el filtro o la página, y en su lugar mostrar la data anterior hasta que llegue la nueva data, esto mejora la experiencia del usuario al evitar parpadeos o estados de carga vacíos innecesarios;
  });
}

export default useTodos;
