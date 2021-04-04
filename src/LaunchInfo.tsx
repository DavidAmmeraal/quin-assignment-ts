import React from "react";
import { Launch } from "./api";

type LaunchInfoProps = {
  launch: Launch;
};

export const LaunchInfo = (props: LaunchInfoProps) => {
  const labelId = `launchTitle_${props.launch.id}`;
  return (
    <div className="bg-white p-5 rounded-md"
      role="dialog"
      aria-labelledby={labelId}
    >
      <h2 id={labelId} className="text-2xl">{props.launch.name}</h2>
      <div>
        <b>Time: </b>
        <span>{props.launch.windowStart.toLocaleString()}</span>
      </div>
      <div>
        <b>Agency: </b>
        <span>{props.launch.agencyName}</span>
      </div>
    </div>
  );
};
