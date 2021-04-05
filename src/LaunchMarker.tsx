import React, { CSSProperties, useEffect, useState } from "react";
import { MapContext } from "react-map-gl";
import { usePopper } from "react-popper";
import { LaunchInfo } from "./LaunchInfo";
import { Launch } from "./api";

type LaunchMarkerProps = {
  launch: Launch;
  focus: boolean;
};

export const LaunchMarker: React.FC<LaunchMarkerProps> = (props) => {
  const context = React.useContext(MapContext);

  const { launch, focus } = props;

  const [popperVisible, setPopperVisible] = useState(focus);
  const [
    referenceElement,
    setReferenceElement,
  ] = useState<HTMLDivElement | null>(null);
  const [popperElement, setPopperElement] = useState<HTMLDivElement | null>(
    null
  );

  const { styles, attributes } = usePopper(referenceElement, popperElement, {});

  const [x, y] =
    context.viewport?.project([launch.longitude, launch.latitude]) || [];

  const markerStyle: CSSProperties = {
    position: "absolute",
    left: 0,
    top: 0,
    transform: `translate3d(${x}px, ${y}px, 0)`,
  };

  useEffect(() => {
    if(focus) {
      referenceElement?.focus();
    }
  }, [focus, referenceElement]);

  useEffect(() => {
    const listener = (e: any) => {
      if (!popperElement?.contains(e.target) && e.target !== referenceElement) {
        setPopperVisible(false);
      }
    };
    window.addEventListener("click", listener);
    return () => {
      window.removeEventListener("click", listener);
    };
  }, [popperElement, popperVisible, referenceElement]);

  return (
    <>
      <div
        tabIndex={0}
        aria-label={`Launch ${launch.id}`}
        role="button"
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
          style={{ ...styles.popper, zIndex: 99 }}
          {...attributes.popper}
        >
          <LaunchInfo launch={launch} />
        </div>
      )}
    </>
  );
};
