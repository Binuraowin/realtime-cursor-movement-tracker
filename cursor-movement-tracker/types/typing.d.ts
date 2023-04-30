type Draw = {
  ctx: CanvasRenderingContext2D
  currentPoint: Point
  // prevPoint: Point | null
}

type Cursor = {
  ctx: CanvasRenderingContext2D
  currentPoint: Point
  color: string
}

type Point = { x: number; y: number }
