import { useEffect, useState } from "react";

type Todo = {
  id: number;
  title: string;
  completed: string;
  userId: number;
};

export default function App() {
  const [data, setData] = useState<Todo[]>([]);

  useEffect(() => {
    fetch("https://jsonplaceholder.typicode.com/todos")
      .then((response) => response.json() as Promise<Todo[]>)
      .then((json) => setData(json));
  }, []);

  return (
    <>
      <h2>Todos</h2>
      <ul>
        {data.map((todo) => (
          <li key={todo.id}>{todo.title}</li>
        ))}
      </ul>
    </>
  );
}
