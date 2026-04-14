import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

import App from "./App.tsx";

// Lo siguiente configura de forma global todas las queries de la aplicación
/*const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2, // número de renitentos para ir por los datos
      staleTime: 60 * 1000, //*60 segundos, de vigencia de los datos,
      gcTime:
        5 *
        60 *
        1000, // 5 minutos, no hay un componente que lo este observando para limpieza de los datos ,
      refetchOnMount: true, //  para datos que no cambian tanto, puede ser false ,
      refetchOnReconnect: true, //  si tenemos una aplicacion que se conecta y desconecta y no queremos ir a buscar los datos nuevamente pude establecerse en false ,
      refetchOnWindowFocus: true, // si nos cambiamos de aplicacion o de pestaña y regresamos a la aplicacion con esto se vuelven a cargar los datos ,
    },
  },
});*/

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  </StrictMode>,
);
