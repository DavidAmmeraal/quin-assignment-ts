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

  if(hasNextPage && !isFetchingNextPage) {
    fetchNextPage();
  }

  return {
    data,
    error,
    isFetching,
    status
  }
}