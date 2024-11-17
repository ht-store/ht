import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { Suspense } from "react"
import AppRouter from "./routes";
import AuthProvider from "./context/auth/auth-provider";

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


function App() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
        retry: false,
      },
    },
  });

  return (
    <Suspense>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <AppRouter />
          <ToastContainer autoClose={2000}/>
        </AuthProvider>
      </QueryClientProvider>
    </Suspense>
  )
}

export default App
