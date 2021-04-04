import React from "react";
import { Launch, LaunchFilters } from "./api";

type LaunchFilterProps = {
  filter: LaunchFilters;
  onChange: (filters: LaunchFilters) => void;
  launches: Launch[];
};

export const LaunchFilter: React.FC<LaunchFilterProps> = ({
  filter,
  onChange,
  launches,
}) => {
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
      status: (e.target.value as unknown) as string,
    });
  };

  const handleAgencyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange({
      ...filter,
      agencyId: (e.target.value as unknown) as string,
    })
  }

  const agencies = launches.reduce((acc, curr) => {
    const existing = acc.find(c => c.id === curr.agencyId);
    if(!existing) {
      return [...acc, { id: curr.agencyId, name: curr.agencyName}]
    }
    return acc;
  }, [] as { id: string, name: string}[]);

  return (
    <form
      className="w-screen p-2 flex space-x-2 items-center"
    >
      <label htmlFor="launchStart">Launches after</label>
      <input
        className="p-2 rounded-md border-2 border-indigo-600"
        type="date"
        id="launchStart"
        max={filter.dateEnd?.toISOString().split("T")[0]}
        value={filter.dateStart?.toISOString().split("T")[0]}
        onChange={handleStartChange}
      />
      <label htmlFor="launchEnd">Launches before</label>
      <input
        className="p-2 rounded-md border-2 border-indigo-600"
        id="launchEnd"
        type="date"
        min={filter.dateStart?.toISOString().split("T")[0]}
        value={filter.dateEnd?.toISOString().split("T")[0]}
        onChange={handleEndChange}
      />

      <label htmlFor="launchStatus">Launch status</label>
      <select
        className="p-2 rounded-md border-2 border-indigo-600"
        id="launchStatus"
        value={filter.status}
        onChange={handleStatusChange}
      >
        <option value={0}>Any</option>
        <option value={3}>Success</option>
        <option value={4}>Failed</option>
      </select>

      <label htmlFor="launchAgency">Agency</label>
      <select
        className="p-2 rounded-md border-2 border-indigo-600"
        id="launchAgency"
        value={filter.agencyId}
        onChange={handleAgencyChange}
      >
        <option value={""}>Any</option>
        {agencies.map(({ id, name }) => {
          return (<option value={id} key={id} data-testid={`agencyFilterOption_${id}`}>{name}</option>)
        })}
      </select>
    </form>
  );
};
