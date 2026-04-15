import useTodos from "./hooks/useTodos";

export default function App() {
  const pageSize = 15;

  const { data, error, isLoading, fetchNextPage, isFetchingNextPage } =
    useTodos(pageSize);

  if (error) {
    return <h2>{error.message} :(</h2>;
  }

  if (isLoading) {
    return <h2>Loading...</h2>;
  }

  // console.log(data);
  const todos = data?.pages.flat();

  return (
    <>
      <h2>Todos</h2>

      <ul>
        {todos?.map((todo) => (
          <li key={todo.id}>{todo.title}</li>
        ))}
      </ul>

      <button disabled={isFetchingNextPage} onClick={() => fetchNextPage()}>
        {isFetchingNextPage ? "Cargando..." : "Cargar más ..."}
      </button>
    </>
  );
}
