import { useEffect } from "react";
import { useInfiniteQuery } from "react-query";
import { fetchLaunches, LaunchFilters } from "./api";

type UseLaunchesOptions = {
    filter?: LaunchFilters
}

export const useLaunches = ({ filter}: UseLaunchesOptions) => {
  const {
     data,
     error,
     fetchNextPage,
     hasNextPage,
     isFetching,
     isFetchingNextPage,
     status,
   } = useInfiniteQuery(['launches', filter], ({ pageParam }) => fetchLaunches({ pageParam, ...filter }), {
     getNextPageParam: (lastPage, pages) => {
       return lastPage.nextCursor;
     }
   })

  useEffect(() => {
    if(!isFetchingNextPage && hasNextPage) {
      fetchNextPage();
    }
  }, [isFetchingNextPage, hasNextPage, fetchNextPage])

  return {
    data,
    error,
    isFetching,
    status
  }
}