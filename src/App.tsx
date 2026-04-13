import useTodos from "./hooks/useTodos";

export default function App() {
  const { data, error, isLoading } = useTodos();

  if (error) {
    return <h2>{error.message} :(</h2>;
  }

  if (isLoading) {
    return <h2>Loading...</h2>;
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
