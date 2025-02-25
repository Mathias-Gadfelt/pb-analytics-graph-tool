import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./utils/trpc";

function App() {
  return <QueryClientProvider client={queryClient}>tester</QueryClientProvider>;
}

export default App;
