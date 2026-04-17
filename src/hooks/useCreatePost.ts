import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { Post } from "../types";
import axios from "axios";

export default function useCreatePost(onCreate: () => void) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (post: Post) =>
      axios
        .post<Post>("https://jsonplaceholder.typicode.com/posts", post)
        .then((response) => response.data),
    onMutate: (newPost) => {
      const oldPost = queryClient.getQueryData<Post[]>(["posts"]);
      //optimistic update, actualizar la UI antes de que la mutación se complete, para mejorar la experiencia del usuario, pero si la mutación falla, entonces se debe revertir el cambio en la UI, para eso se puede usar el método setQueryData para actualizar los datos de la query en la cache de React Query, y así se actualiza la UI con los datos correctos después de que la mutación falle
      queryClient.setQueryData<Post[]>(["posts"], (post = []) => [
        newPost,
        ...post,
      ]);

      //queryClient.invalidateQueries({ queryKey: ["posts"] }); // ir a buscar todo al servidor nuevamente, en este caso no es necesario porque ya tenemos el post guardado en la respuesta de la mutación, pero si queremos ir a buscar todo al servidor nuevamente, por ejemplo para obtener el id generado por el servidor, entonces si sería necesario invalidar la query para que se vuelva a ejecutar y obtener los datos actualizados del servidor

      onCreate();
      return oldPost; // se devuelve el estado anterior para poder usarlo en caso de error y revertir el cambio en la UI
    },
    onSuccess: (savedPost, newPost) => {
      //actualizar la cache de React Query con los datos del post guardado en el servidor, para que la UI se actualice con los datos correctos después de que la mutación se complete, por ejemplo para obtener el id generado por el servidor, entonces si sería necesario invalidar la query para que se vuelva a ejecutar y obtener los datos actualizados del servidor
      queryClient.setQueryData<Post[]>(["posts"], (post = []) =>
        post.map((post) => (post.id === newPost.id ? savedPost : post)),
      );
    },
    /*
    // primera forma para devolverse al estado anterior en caso de error, pero no es tan eficiente porque se hace una consulta al servidor para obtener los datos actualizados, lo que puede ser lento y generar una mala experiencia de usuario, además de generar tráfico innecesario al servidor, por lo que es mejor usar la segunda forma que es más eficiente porque se guarda el estado anterior en la función onMutate y se usa ese estado para actualizar la cache de React Query en caso de error, sin necesidad de hacer una consulta al servidor para obtener los datos actualizados
    onError: (error, newPost, context) => {
      queryClient.setQueryData<Post[]>(["posts"], (post = []) => {
        return post.filter((post) => post.id !== newPost.id);
      });
    },*/

    // segunda forma para devolverse al estado anterior en caso de error, es más eficiente porque se guarda el estado anterior en la función onMutate y se usa ese estado para actualizar la cache de React Query en caso de error, sin necesidad de hacer una consulta al servidor para obtener los datos actualizados
    onError: (error, newPost, context) => {
      queryClient.setQueryData<Post[]>(["posts"], context);
    },
  });
}
