import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useRef } from "react";
import type { Post } from "./types";
import useCreatePost from "./hooks/useCreatePost";

export default function App() {
  const titleRef = useRef<HTMLInputElement>(null);
  const bodyRef = useRef<HTMLInputElement>(null);

  const { mutate, isPending, error } = useCreatePost(() => {
    if (titleRef.current?.value && bodyRef.current?.value) {
      titleRef.current.value = "";
      bodyRef.current.value = "";
    }
  });

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
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (titleRef.current?.value && bodyRef.current?.value) {
            mutate({
              id: 0,
              body: bodyRef.current?.value,
              title: titleRef.current?.value,
              userId: 1,
            });
          }
        }}
      >
        <div>
          <input ref={titleRef} type="text" placeholder="Título" />
        </div>
        <div>
          <input ref={bodyRef} type="text" placeholder="Cuerpo" />
        </div>
        <div>
          <button disabled={isPending}>
            {isPending ? "Creando..." : "Enviar"}
          </button>
          {error && <span>{error.message}</span>}
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
