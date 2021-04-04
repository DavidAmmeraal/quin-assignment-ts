import React, { useState } from "react";
import { Launch, LaunchFilters } from "./api";
import "./App.css";
import 'mapbox-gl/dist/mapbox-gl.css';
import { LaunchMap } from "./LaunchesMap";
import { LaunchFilter } from "./LaunchFilters";
import { useLaunches } from "./useLaunches";

const defaultFilter = () => {
  const dateStart = new Date();
  const dateEnd = new Date(new Date().setMonth(dateStart.getMonth() + 3));

  return { 
    dateStart,
    dateEnd
  };
};

function App() {
  const [filter, setFilter] = useState<LaunchFilters>(defaultFilter());

  const { data, error } = useLaunches({ filter });
  
  const launches =
    data?.pages.reduce((acc, curr) => {
      return [...acc, ...curr.data];
    }, [] as Launch[]) || [];

  return (
      <div className="w-screen h-screen flex flex-col relative">
        <header className="p-2">
          <h1 className="text-xl">Launches map</h1>
        </header>
        <LaunchFilter filter={filter} onChange={setFilter} launches={launches} />
        {!error ? (
          <LaunchMap launches={launches} />
        ) : (
          <div className="w-full h-full" role="alert" id="error">
            An error occurred, please try again later.
          </div>
        )}
      </div>
  );
}

export default App;
