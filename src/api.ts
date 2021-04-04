import axios from "axios";
import { LaunchSerializerCommon } from "./generated";

export type Launch = {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  windowStart: Date;
  windowEnd: Date;
  agencyId: string;
  agencyName: string;
};

export type LaunchFilters = {
  dateStart?: Date;
  dateEnd?: Date;
  status?: string,
  agencyId?: string,
}

export async function fetchLaunches(args: LaunchFilters & {
  pageParam?: number,
  limit?: number
}) {
  const { dateStart, dateEnd, pageParam = 0, limit = 10, status = undefined, agencyId } = args;

  const params = {
    status,
    window_start__gte: dateStart,
    window_end__lte: dateEnd,
    offset: pageParam,
    lsp__ids: agencyId,
    limit,
  }

  const response = await axios.get("https://lldev.thespacedevs.com/2.2.0/launch/", { params, timeout: 2000 })

  const hasNext = !!response.data?.next;

  const nextCursor = hasNext ? pageParam + limit : null;

  const data: Launch[] = response.data?.results?.map((r: LaunchSerializerCommon) => {
    return {
      id: r.id,
      name: r.name,
      agencyId: r.launch_service_provider?.id,
      agencyName: r.launch_service_provider?.name,
      latitude: parseFloat(r.pad?.latitude || ''),
      longitude: parseFloat(r.pad?.longitude || ''),
      windowStart: new Date(r.window_start || ''),
      windowEnd: new Date(r.window_end || '')
    }
  }) || [];

  return {
    data,
    nextCursor,
  };
}