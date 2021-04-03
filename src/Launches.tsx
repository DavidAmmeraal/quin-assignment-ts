import React from "react";
import { Launch, LaunchFilters } from "./api";
import ReactMapGL, { Layer, Source, SourceProps } from "react-map-gl";
import { useLaunches } from "./useLaunches";
import { LaunchMarker } from "./LaunchMarker";
import { LaunchesLoading } from "./LaunchesLoading";

type LaunchesProps = {
  filter?: LaunchFilters;
};

export const Launches: React.FC<LaunchesProps> = (props) => {
  const { filter } = props;

  const [viewport, setViewport] = React.useState({
    latitude: 54.5426,
    longitude: 15.2551,
    zoom: 1.6,
  });

  const { data, error } = useLaunches({ filter });

  const launches =
    data?.pages.reduce((acc, curr) => {
      return [...acc, ...curr.data];
    }, [] as Launch[]) || [];

  return !error ? (
    <ReactMapGL
      {...viewport}
      mapboxApiAccessToken={process.env.REACT_APP_MAPBOX_ACCESS_TOKEN}
      width="100%"
      height="100%"
      onViewportChange={(vp: typeof viewport) => setViewport(vp)}
    >
      <div className="absolute right-5 top-5">
        <LaunchesLoading />
      </div>
      {launches.map((launch) => (
        <LaunchMarker key={launch.id} launch={launch} />
      ))}
    </ReactMapGL>
  ) : (
    <div className="w-full h-full">
      An error occurred, please try again later.
    </div>
  );
};
