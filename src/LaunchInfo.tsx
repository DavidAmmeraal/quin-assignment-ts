import React from "react";
import { Launch } from "./api";

type LaunchInfoProps = {
  launch: Launch;
};

export const LaunchInfo = (props: LaunchInfoProps) => {
  return (
    <div className="bg-white">
      <h2 className="text-2xl">{props.launch.name}</h2>
      <div>
        <b>Time: </b>
        <span>{props.launch.windowStart.toTimeString()}</span>
      </div>
      <div>
        <b>Agency: </b>
        <span>{props.launch.agency}</span>
      </div>
    </div>
  );
};
