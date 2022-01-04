import Position, { XY } from "./position";
import { State } from "./usePanZoom";

const MAX_ZOOM = 4;
const MIN_ZOOM = 0.1;

// When zooming, cap the maximum zoom delta to the equivalent of panning 50 pixels with the mouse wheel.
// This prevents mouse wheels which are configured with a high sensitivity from making massive zoom leaps with each wheel movement.
const MAX_DELTA = 50;

const applyTransformation = ({
  target,
  newState,
}: {
  target: HTMLDivElement;
  newState: State;
}) => {
  requestAnimationFrame(() => {
    const targetElement = target;
    targetElement.style.transformOrigin = `${newState.origin.x}px ${newState.origin.y}px`;
    targetElement.style.transform = `matrix(${newState.zoom}, 0, 0, ${newState.zoom}, ${newState.translate.x}, ${newState.translate.y})`;
  });
};

export const pan = ({
  state,
  target,
  delta,
  zoom,
}: {
  state: State;
  target: HTMLDivElement;
  delta: XY;
  zoom?: number;
}): State => {
  const newState = {
    origin: state.origin,
    translate: Position.add(state.translate, delta),
    zoom: zoom || state.zoom,
  };
  applyTransformation({
    target,
    newState: newState,
  });

  return newState;
};

const calculateZoomWithMultiplier = ({
  zoom,
  delta,
}: {
  zoom: number;
  delta: number;
}) => {
  const cappedDelta = Math.min(MAX_DELTA, Math.max(-MAX_DELTA, delta));
  const newZoom = zoom + cappedDelta * -0.01;
  return Number(Math.max(MIN_ZOOM, Math.min(newZoom, MAX_ZOOM)));
};

const calculateTranslate = ({
  state,
  newZoom,
  newOrigin,
}: {
  state: State;
  newZoom: number;
  newOrigin: XY;
}) => {
  if (newZoom <= MAX_ZOOM && newZoom >= MIN_ZOOM) {
    const prevOrigin = Position.multiply(state.origin, state.zoom);
    const originDelta = Position.subtract(newOrigin, prevOrigin);
    const scaledOriginDelta = Position.multiply(
      originDelta,
      1 - 1 / state.zoom
    );
    return Position.sum(state.translate, scaledOriginDelta);
  }
  return state.translate;
};

export const zoom = ({
  state,
  targetElement,
  pointerPosition,
  delta,
}: {
  state: State;
  targetElement: HTMLDivElement;
  pointerPosition: XY;
  delta: number;
}) => {
  const rect = targetElement.getBoundingClientRect();
  const zoomOrigin = Position.subtract(pointerPosition, rect);
  const scaledZoomOrigin = Position.divide(zoomOrigin, state.zoom);
  const newZoom = calculateZoomWithMultiplier({ zoom: state.zoom, delta });
  const newTranslate = calculateTranslate({
    state: state,
    newZoom,
    newOrigin: zoomOrigin,
  });

  const newState = {
    origin: scaledZoomOrigin,
    translate: newTranslate,
    zoom: newZoom,
  };

  applyTransformation({
    target: targetElement,
    newState: newState,
  });

  return newState;
};
