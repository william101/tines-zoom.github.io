import { MutableRefObject, useEffect, useRef, useState } from "react";
import Position, { XY } from "./position";
import { pan, zoom } from "./transforms";

export type State = {
  origin: XY;
  translate: XY;
  zoom: number;
};

type Props = {
  container: MutableRefObject<HTMLDivElement | null>;
  target: MutableRefObject<HTMLDivElement | null>;
};

export default function usePanZoom({ container, target }: Props) {
  const state = useRef<State>({
    origin: Position.zero,
    translate: Position.zero,
    zoom: 1,
  });

  const [mouseIsDown, setMouseIsDown] = useState(false);

  const onMouseDown = () => {
    setMouseIsDown(true);
  };
  const onMouseUp = () => {
    setMouseIsDown(false);
  };

  const onMouseMove = (event: MouseEvent) => {
    event.preventDefault();

    if (!target.current) return;

    const newState = pan({
      state: state.current,
      target: target.current,
      delta: { x: event.movementX, y: event.movementY },
    });

    state.current = newState;
  };

  const onWheel = (event: WheelEvent) => {
    // no-op if any mouse button is pressed
    if (event.buttons !== 0) return;
    if (!target.current) return;

    // Pan
    if (!event.metaKey && !event.ctrlKey) {
      event.preventDefault();
      const newState = pan({
        state: state.current,
        target: target.current,
        delta: Position.multiply({ x: event.deltaX, y: event.deltaY }, -1),
      });
      state.current = newState;
      return;
    }

    // Zoom: CMD/CTRL + Mouse wheel to zoom
    if (event.metaKey || event.ctrlKey) {
      event.preventDefault();

      const newState = zoom({
        state: state.current,
        targetElement: target.current,
        pointerPosition: { x: event.pageX, y: event.pageY },
        delta: event.deltaY,
      });

      state.current = newState;
      return;
    }
  };

  useEffect(() => {
    const containerElement = container.current;
    if (containerElement) {
      containerElement.addEventListener("mousedown", onMouseDown);
      if (mouseIsDown) {
        document.addEventListener("mousemove", onMouseMove);
      }
      document.addEventListener("mouseup", onMouseUp);

      containerElement.addEventListener("wheel", onWheel, { passive: false });
    }
    return () => {
      document.removeEventListener("mouseup", onMouseUp);
      document.removeEventListener("mousemove", onMouseMove);
      containerElement?.removeEventListener("wheel", onWheel);
    };
  });
}
