import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";

type Todo = {
  id: number;
  title: string;
  completed: string;
  userId: number;
};

const queryTodos = (): Promise<Todo[]> =>
  fetch("https://jsonplaceholder.typicode.com/todosx").then((response) => {
    if (!response.ok) {
      throw new Error(`Error ${response.status}`);
    }
    return response.json();
  });

export default function App() {
  const { data, error } = useQuery({
    queryKey: ["todos"],
    queryFn: queryTodos,
  });

  if (error) {
    return <h2>{error.message} :(</h2>;
  }

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
