import React, { CSSProperties, useEffect, useState } from "react";
import { MapContext } from "react-map-gl";
import { usePopper } from "react-popper";
import { LaunchInfo } from "./LaunchInfo";
import { Launch } from "./api";

type LaunchMarkerProps = {
  launch: Launch;
};

export const LaunchMarker: React.FC<LaunchMarkerProps> = (props) => {
  const context = React.useContext(MapContext);

  const { launch } = props;

  const [popperVisible, setPopperVisible] = useState(false);
  const [
    referenceElement,
    setReferenceElement,
  ] = useState<HTMLDivElement | null>(null);
  const [popperElement, setPopperElement] = useState<HTMLDivElement | null>(
    null
  );
  const [arrowElement, setArrowElement] = useState<HTMLDivElement | null>(null);
  const { styles, attributes } = usePopper(referenceElement, popperElement, {
    modifiers: [{ name: "arrow", options: { element: arrowElement } }],
  });

  const [x, y] =
    context.viewport?.project([launch.longitude, launch.latitude]) || [];

  const markerStyle: CSSProperties = {
    position: "absolute",
    background: "#fff",
    left: x,
    top: y,
  };

  useEffect(() => {
    const listener = (e: any) => {
      if (!popperElement?.contains(e.target) && e.target !== referenceElement) {
        console.log(e.target);
        setPopperVisible(false);
      }
    };
    if (popperVisible) {
      window.addEventListener("click", listener);
    }

    return () => {
      window.removeEventListener("click", listener);
    };
  }, [popperElement, popperVisible, referenceElement]);

  return (
    <>
      <div
        ref={setReferenceElement}
        style={markerStyle}
        className="cursor-pointer"
        onClick={() => setPopperVisible(true)}
      >
        🚀
      </div>
      {popperVisible && (
        <div
          ref={setPopperElement}
          style={styles.popper}
          {...attributes.popper}
        >
          <LaunchInfo launch={launch} />
        </div>
      )}
    </>
  );
};
