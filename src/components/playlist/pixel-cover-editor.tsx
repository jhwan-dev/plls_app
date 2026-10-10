"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { PIXEL_PALETTE, PIXEL_COVER_GRID } from "@/lib/pixel-palette";

const CELL = 9; // on-screen px per cell — 32 * 9 = 288px, comfortable for touch
const EXPORT_CELL = 16; // final PNG renders at 32 * 16 = 512px, crisp at any display size
const MAX_HISTORY = 40;

type Grid = (string | null)[][];

function makeGrid(): Grid {
  return Array.from({ length: PIXEL_COVER_GRID }, () => Array<string | null>(PIXEL_COVER_GRID).fill(null));
}

function cloneGrid(grid: Grid): Grid {
  return grid.map((row) => row.slice());
}

interface PixelCoverEditorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Exports the drawing as a PNG File and hands it to the same upload path a
   * regular file picker would use — see PlaylistCoverEditor. */
  onSave: (file: File) => Promise<void>;
}

/** A 32×32 pixel-art drawing tool for a playlist cover — pen, eraser, undo,
 * and the app's fixed 24-color palette. Every cover on PLLS is already
 * pixel art (see lib/pixel-art.ts's generated fallback); this is where a
 * user paints their own instead. */
export function PixelCoverEditor({ open, onOpenChange, onSave }: PixelCoverEditorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  // Not reset in an effect — Sheet's Popup unmounts while closed (no
  // `keepMounted`), so every open is already a fresh component instance
  // with fresh ref/state initial values.
  const gridRef = useRef<Grid>(makeGrid());
  const historyRef = useRef<Grid[]>([]);
  const isDrawingRef = useRef(false);
  const [tool, setTool] = useState<"pen" | "eraser">("pen");
  const [color, setColor] = useState<string>(PIXEL_PALETTE[0]!);
  const [canUndo, setCanUndo] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Paints the (blank) background once the canvas exists — everything
  // after this is imperative, driven by pointer events, not React state.
  useEffect(() => {
    render();
  }, []);

  function render() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.imageSmoothingEnabled = false;
    ctx.fillStyle = "#F3F1E9";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    const grid = gridRef.current;
    for (let y = 0; y < PIXEL_COVER_GRID; y++) {
      for (let x = 0; x < PIXEL_COVER_GRID; x++) {
        const value = grid[y]![x];
        if (value) {
          ctx.fillStyle = value;
          ctx.fillRect(x * CELL, y * CELL, CELL, CELL);
        }
      }
    }

    // Grid lines — on-screen only (see the separate, line-free export
    // canvas in handleSave) so each cell stays easy to target while drawing.
    ctx.fillStyle = "rgba(38, 37, 33, 0.12)";
    for (let i = 0; i <= PIXEL_COVER_GRID; i++) {
      ctx.fillRect(i * CELL, 0, 1, canvas.height);
      ctx.fillRect(0, i * CELL, canvas.width, 1);
    }
  }

  function paintAt(clientX: number, clientY: number, activeTool: "pen" | "eraser", activeColor: string) {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const x = Math.floor(((clientX - rect.left) * scaleX) / CELL);
    const y = Math.floor(((clientY - rect.top) * scaleY) / CELL);
    if (x < 0 || y < 0 || x >= PIXEL_COVER_GRID || y >= PIXEL_COVER_GRID) return;

    const value = activeTool === "eraser" ? null : activeColor;
    if (gridRef.current[y]![x] !== value) {
      gridRef.current[y]![x] = value;
      render();
    }
  }

  function handlePointerDown(event: React.PointerEvent<HTMLCanvasElement>) {
    event.currentTarget.setPointerCapture(event.pointerId);
    historyRef.current.push(cloneGrid(gridRef.current));
    if (historyRef.current.length > MAX_HISTORY) historyRef.current.shift();
    setCanUndo(true);
    isDrawingRef.current = true;
    paintAt(event.clientX, event.clientY, tool, color);
  }

  function handlePointerMove(event: React.PointerEvent<HTMLCanvasElement>) {
    if (isDrawingRef.current) paintAt(event.clientX, event.clientY, tool, color);
  }

  function stopDrawing() {
    isDrawingRef.current = false;
  }

  function handleUndo() {
    const previous = historyRef.current.pop();
    if (previous) {
      gridRef.current = previous;
      render();
    }
    setCanUndo(historyRef.current.length > 0);
  }

  async function handleSave() {
    setIsSaving(true);
    setError(null);

    try {
      const exportCanvas = document.createElement("canvas");
      const size = PIXEL_COVER_GRID * EXPORT_CELL;
      exportCanvas.width = size;
      exportCanvas.height = size;
      const ctx = exportCanvas.getContext("2d");
      if (!ctx) throw new Error("캔버스를 사용할 수 없습니다.");
      ctx.imageSmoothingEnabled = false;
      ctx.fillStyle = "#F3F1E9";
      ctx.fillRect(0, 0, size, size);
      const grid = gridRef.current;
      for (let y = 0; y < PIXEL_COVER_GRID; y++) {
        for (let x = 0; x < PIXEL_COVER_GRID; x++) {
          const value = grid[y]![x];
          if (value) {
            ctx.fillStyle = value;
            ctx.fillRect(x * EXPORT_CELL, y * EXPORT_CELL, EXPORT_CELL, EXPORT_CELL);
          }
        }
      }

      const blob: Blob | null = await new Promise((resolve) => exportCanvas.toBlob(resolve, "image/png"));
      if (!blob) throw new Error("이미지를 만들지 못했습니다.");

      const file = new File([blob], "pixel-cover.png", { type: "image/png" });
      await onSave(file);
      onOpenChange(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "저장에 실패했습니다.");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="items-center">
        <SheetHeader className="items-center text-center">
          <SheetTitle>커버 직접 그리기</SheetTitle>
        </SheetHeader>

        <div className="border border-border bg-[#F3F1E9] p-2">
          <canvas
            ref={canvasRef}
            width={PIXEL_COVER_GRID * CELL}
            height={PIXEL_COVER_GRID * CELL}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={stopDrawing}
            onPointerCancel={stopDrawing}
            onPointerLeave={stopDrawing}
            className="block touch-none [image-rendering:pixelated]"
            style={{ width: PIXEL_COVER_GRID * CELL, height: PIXEL_COVER_GRID * CELL }}
          />
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setTool("pen")}
            className={cn(
              "border px-3 py-1.5 font-mono text-xs font-semibold",
              tool === "pen" ? "border-foreground bg-foreground text-background" : "border-border text-muted-foreground",
            )}
          >
            PEN
          </button>
          <button
            type="button"
            onClick={() => setTool("eraser")}
            className={cn(
              "border px-3 py-1.5 font-mono text-xs font-semibold",
              tool === "eraser"
                ? "border-foreground bg-foreground text-background"
                : "border-border text-muted-foreground",
            )}
          >
            ERASER
          </button>
          <button
            type="button"
            onClick={handleUndo}
            disabled={!canUndo}
            className="border border-border px-3 py-1.5 font-mono text-xs font-semibold text-muted-foreground disabled:opacity-40"
          >
            UNDO
          </button>
        </div>

        <div className="grid w-full max-w-[280px] grid-cols-6 gap-1.5 px-4">
          {PIXEL_PALETTE.map((swatch) => (
            <button
              key={swatch}
              type="button"
              aria-label={swatch}
              onClick={() => {
                setColor(swatch);
                setTool("pen");
              }}
              className={cn(
                "aspect-square border border-black/15",
                color === swatch && tool === "pen" && "outline-2 outline-offset-2 outline-primary",
              )}
              style={{ background: swatch }}
            />
          ))}
        </div>

        {error && <p className="px-4 text-sm text-destructive">{error}</p>}

        <SheetFooter className="w-full flex-row gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isSaving}
            className="flex-1"
          >
            취소
          </Button>
          <Button type="button" onClick={handleSave} disabled={isSaving} className="flex-1">
            {isSaving ? "저장 중..." : "저장"}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
