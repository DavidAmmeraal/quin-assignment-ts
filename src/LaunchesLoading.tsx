import { useIsFetching } from "react-query";
import cx from "classnames"

export function LaunchesLoading() {
  const isFetching = useIsFetching();

  return isFetching ? (
    <div 
      className={cx("bg-white p-5", isFetching ? "block" : "hidden")} 
      role="alert" 
      aria-busy={true}
    >
      Loading launches...
    </div>
  ) : null;
} 
