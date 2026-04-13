import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";

type Todo = {
  id: number;
  title: string;
  completed: string;
  userId: number;
};

const queryTodos = (): Promise<Todo[]> =>
  fetch("https://jsonplaceholder.typicode.com/todos").then((response) =>
    response.json(),
  );

export default function App() {
  const { data } = useQuery({
    queryKey: ["todos"],
    queryFn: queryTodos,
  });

  return (
    <>
      <h2>Todos</h2>
      <ul>
        {data?.map((todo) => (
          <li key={todo.id}>{todo.title}</li>
        ))}
      </ul>
    </>
  );
}
