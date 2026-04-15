import { useQuery } from "@tanstack/react-query";
import axios from "axios";

type Post = {
  id: number;
  title: string;
  body: string;
  userId: number;
};

export default function App() {
  const { data, isLoading } = useQuery({
    queryKey: ["posts"],
    queryFn: () =>
      axios
        .get<Post[]>("https://jsonplaceholder.typicode.com/posts?_limit=10")
        .then((response) => response.data),
  });
  return (
    <>
      <h2>Posts</h2>
      <form>
        <div>
          <input type="text" />
        </div>
        <div>
          <button>Enviar</button>
        </div>
      </form>
      {isLoading && <p>Cargando...</p>}

      <ul>
        {data?.map((post) => (
          <li key={post.id}>{post.title}</li>
        ))}
      </ul>
    </>
  );
}
