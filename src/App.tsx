import React, { useState } from "react";
import { QueryClientProvider, QueryClient } from "react-query";
import { LaunchFilters } from "./api";
import "./App.css";
import { Launches } from "./Launches";
import { LaunchesLoading } from "./LaunchesLoading";
import { LaunchFilter } from "./LaunchFilters";

const queryClient = new QueryClient();

const dateStart = new Date();
const dateEnd = new Date(new Date().setMonth(dateStart.getMonth() + 3));

const filter: LaunchFilters = {
  dateStart: new Date(),
  dateEnd,
};

function App() {
  const [filters, setFilters] = useState<LaunchFilters>(filter);

  return (
    <QueryClientProvider client={queryClient}>
      <div className="w-screen h-screen flex flex-col relative">
        <LaunchFilter filter={filters} onChange={setFilters} />
        <Launches filter={filters} />
      </div>
    </QueryClientProvider>
  );
}

export default App;
