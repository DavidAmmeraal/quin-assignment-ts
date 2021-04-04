import React, { useEffect } from "react";
import { Launch } from "./api";
import ReactMapGL from "react-map-gl";
import { LaunchMarker } from "./LaunchMarker";
import { LaunchesLoading } from "./LaunchesLoading";

type LaunchesMapProps = {
  launches: Launch[]
};

export const LaunchMap: React.FC<LaunchesMapProps> = (props) => {
  const { launches } = props;

  const firstLaunch = launches[0];

  const [viewport, setViewport] = React.useState({
    latitude: 54.5426,
    longitude: 15.2551,
    zoom: 1.6,
  });

  useEffect(() => {
    if(!firstLaunch) return;
    setViewport({
      latitude: firstLaunch.latitude,
      longitude: firstLaunch.longitude,
      zoom: 5
    })
  }, [firstLaunch]);

  return (
    <div className="w-full h-full relative">
      <ReactMapGL
        {...viewport}
        mapboxApiAccessToken={process.env.REACT_APP_MAPBOX_ACCESS_TOKEN}
        width="100%"
        height="100%"
        onViewportChange={setViewport}
      >
        {launches.map((launch, index) => (
          <LaunchMarker key={launch.id} launch={launch} focus={index === 0}/>
        ))}
      </ReactMapGL>
      <div className="absolute right-5 top-5">
        <LaunchesLoading />
      </div>
    </div>
  );
};
