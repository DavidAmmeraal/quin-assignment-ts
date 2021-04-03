import React from "react";
import { collapseTextChangeRangesAcrossMultipleVersions } from "typescript";
import { LaunchFilters, LaunchStatus } from "./api";

type LaunchFilterProps = {
  filter: LaunchFilters;
  onChange: (filters: LaunchFilters) => void;
};

export const LaunchFilter: React.FC<LaunchFilterProps> = ({
  filter,
  onChange,
}) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  const handleStartChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({
      ...filter,
      dateStart: new Date(e.target.value),
    });
  };

  const handleEndChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({
      ...filter,
      dateEnd: new Date(e.target.value),
    });
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange({
      ...filter,
      status: (e.target.value as unknown) as LaunchStatus,
    });
  };

  return (
    <form
      className="w-screen p-2 flex space-x-2 items-center"
      onSubmit={handleSubmit}
    >
      <label htmlFor="launchStart">Launches after</label>
      <input
        className="p-2 rounded-md border-2 border-indigo-600"
        type="date"
        id="launchStart"
        value={filter.dateStart?.toISOString().split("T")[0]}
        onChange={handleStartChange}
      />
      <label htmlFor="launchEnd">Launches before</label>
      <input
        className="p-2 rounded-md border-2 border-indigo-600"
        type="date"
        value={filter.dateEnd?.toISOString().split("T")[0]}
        onChange={handleEndChange}
      />

      {/* I could not get this working properly within time constraints
      <label htmlFor="launchStatus">Launches status</label>
      <select
        className="p-2 rounded-md border-2 border-indigo-600"
        value={filter.status}
        onChange={handleStatusChange}
      >
        <option value={LaunchStatus.ANY}>Any</option>
        <option value={LaunchStatus.SUCCESS}>Success</option>
        <option value={LaunchStatus.FAILED}>Failed</option>
      </select>
      */}
    </form>
  );
};
