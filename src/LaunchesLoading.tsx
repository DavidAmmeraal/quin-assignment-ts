import { useIsFetching } from "react-query";

export function LaunchesLoading() {
  const isFetching = useIsFetching();

  return isFetching ? (
    <div className="bg-white p-5" role="alert" aria-busy="true">Loading launches...</div>
  ) : null;
}
