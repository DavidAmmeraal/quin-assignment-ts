import axios from "axios";

export enum LaunchStatus {
  ANY = 0,
  SUCCESS = 3,
  FAILED = 4
}

export type Launch = {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  windowStart: Date;
  windowEnd: Date;
  agency: String;
};

export type LaunchFilters = {
  dateStart?: Date;
  dateEnd?: Date;
  status?: LaunchStatus,
}

export async function fetchLaunches(args: LaunchFilters & {
  pageParam?: number,
  limit?: number
}) {
  const { dateStart, dateEnd, pageParam = 0, limit = 10, status = undefined } = args;

  const params = {
    status: status === LaunchStatus.ANY ? undefined : status,
    window_start__gte: dateStart,
    window_end__lte: dateEnd,
    offset: pageParam,
    limit,
  }

  const response = await axios.get("https://lldev.thespacedevs.com/2.2.0/launch/", { params });
  const hasNext = !!response.data.next;

  const nextCursor = hasNext ? pageParam + limit : null;

  const data: Launch[] = response.data?.results?.map((r: any) => {
    return {
      id: r.id,
      name: r.name,
      agency: r.launch_service_provider.name,
      latitude: parseFloat(r.pad.latitude),
      longitude: parseFloat(r.pad.longitude),
      windowStart: new Date(r.window_start),
      windowEnd: new Date(r.window_end)
    }
  }) || [];

  return {
    data,
    nextCursor,
  };
}