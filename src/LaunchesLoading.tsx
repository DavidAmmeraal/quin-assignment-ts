import { useIsFetching } from "react-query";

export function LaunchesLoading() {
  const isFetching = useIsFetching();

  return isFetching ? (
    <div className="bg-white p-5">Loading launches...</div>
  ) : null;
}
