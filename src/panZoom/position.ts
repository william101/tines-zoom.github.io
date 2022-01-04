export type XY = { x: number; y: number };

const zero = { x: 0, y: 0 };
const add = (p1: XY, p2: XY) => ({ x: p1.x + p2.x, y: p1.y + p2.y });
const subtract = (p1: XY, p2: XY) => ({ x: p1.x - p2.x, y: p1.y - p2.y });
const sum = (...ps: XY[]) => ps.reduce((summed, i) => add(summed, i), zero);
const multiply = (p: XY, n: number) => ({ x: p.x * n, y: p.y * n });
const divide = (p: XY, n: number) => ({ x: p.x / n, y: p.y / n });

const Position = {
  zero,
  add,
  subtract,
  sum,
  multiply,
  divide,
};

export default Position;
