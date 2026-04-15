import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useRef } from "react";

type Post = {
  id: number;
  title: string;
  body: string;
  userId: number;
};

export default function App() {
  const titleRef = useRef<HTMLInputElement>(null);
  const bodyRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();
  const { mutate, isPending, error } = useMutation({
    mutationFn: (post: Post) =>
      axios
        .post<Post>("https://jsonplaceholder.typicode.com/posts", post)
        .then((response) => response.data),
    onSuccess: (savedPost) => {
      queryClient.setQueryData<Post[]>(["posts"], (post = []) => [
        savedPost,
        ...post,
      ]);

      //queryClient.invalidateQueries({ queryKey: ["posts"] }); // ir a buscar todo al servidor nuevamente, en este caso no es necesario porque ya tenemos el post guardado en la respuesta de la mutación, pero si queremos ir a buscar todo al servidor nuevamente, por ejemplo para obtener el id generado por el servidor, entonces si sería necesario invalidar la query para que se vuelva a ejecutar y obtener los datos actualizados del servidor

      //limpiar el formulario después de guardar el post
      if (titleRef.current?.value && bodyRef.current?.value) {
        titleRef.current.value = "";
        bodyRef.current.value = "";
      }
    },
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
