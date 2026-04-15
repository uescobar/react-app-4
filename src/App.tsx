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
    onMutate: (newPost) => {
      //optimistic update, actualizar la UI antes de que la mutación se complete, para mejorar la experiencia del usuario, pero si la mutación falla, entonces se debe revertir el cambio en la UI, para eso se puede usar el método setQueryData para actualizar los datos de la query en la cache de React Query, y así se actualiza la UI con los datos correctos después de que la mutación falle
      queryClient.setQueryData<Post[]>(["posts"], (post = []) => [
        newPost,
        ...post,
      ]);

      //queryClient.invalidateQueries({ queryKey: ["posts"] }); // ir a buscar todo al servidor nuevamente, en este caso no es necesario porque ya tenemos el post guardado en la respuesta de la mutación, pero si queremos ir a buscar todo al servidor nuevamente, por ejemplo para obtener el id generado por el servidor, entonces si sería necesario invalidar la query para que se vuelva a ejecutar y obtener los datos actualizados del servidor

      //limpiar el formulario después de guardar el post
      if (titleRef.current?.value && bodyRef.current?.value) {
        titleRef.current.value = "";
        bodyRef.current.value = "";
      }
    },
    onSuccess: (savedPost, newPost) => {
      //actualizar la cache de React Query con los datos del post guardado en el servidor, para que la UI se actualice con los datos correctos después de que la mutación se complete, por ejemplo para obtener el id generado por el servidor, entonces si sería necesario invalidar la query para que se vuelva a ejecutar y obtener los datos actualizados del servidor
      queryClient.setQueryData<Post[]>(["posts"], (post = []) =>
        post.map((post) => (post.id === newPost.id ? savedPost : post)),
      );
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
