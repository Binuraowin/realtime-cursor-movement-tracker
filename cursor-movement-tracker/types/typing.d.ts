export type Draw = {
  ctx: CanvasRenderingContext2D
  currentPoint: Point
}

export type Cursor = {
  ctx: CanvasRenderingContext2D
  currentPoint: Point
  color: string
}

export type Point = { x: number; y: number; username: string }
