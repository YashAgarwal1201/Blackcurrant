import { useRef, useEffect, useCallback } from "react";
import pixelmatch from "pixelmatch";
import { Button } from "primereact/button";
import { Slider } from "primereact/slider";
import { Upload, Download, ArrowLeftRight, X } from "lucide-react";
import { triggerImageDiffDownload } from "@/Services/DiffReportGenerator";
import useDiffCheckerStore from "@/Services/Stores/diffCheckerStore";
import useToastStore from "@/Services/Stores/toastMessageStore";

const ImageDiff = () => {
  const {
    originalImage,
    modifiedImage,
    imageDiffThreshold,
    setOriginalImage,
    setModifiedImage,
    setImageDiffThreshold,
  } = useDiffCheckerStore();

  const showToast = useToastStore((s) => s.showToast);
  const diffCanvasRef = useRef<HTMLCanvasElement>(null);
  const diffPixelCountRef = useRef<number>(0);

  const readFileAsDataURL = (file: File): Promise<string> =>
    new Promise((res, rej) => {
      const reader = new FileReader();
      reader.onload = () => res(reader.result as string);
      reader.onerror = rej;
      reader.readAsDataURL(file);
    });

  const handleDrop = useCallback(
    async (e: React.DragEvent, target: "original" | "modified") => {
      e.preventDefault();
      const file = e.dataTransfer.files[0];
      if (!file?.type.startsWith("image/")) {
        showToast("error", "Invalid file", "Please drop an image file");
        return;
      }
      const dataUrl = await readFileAsDataURL(file);
      target === "original"
        ? setOriginalImage(dataUrl)
        : setModifiedImage(dataUrl);
    },
    [setOriginalImage, setModifiedImage, showToast],
  );

  const handleFileInput = useCallback(
    async (
      e: React.ChangeEvent<HTMLInputElement>,
      target: "original" | "modified",
    ) => {
      const file = e.target.files?.[0];
      if (!file) return;
      const dataUrl = await readFileAsDataURL(file);
      target === "original"
        ? setOriginalImage(dataUrl)
        : setModifiedImage(dataUrl);
    },
    [setOriginalImage, setModifiedImage],
  );

  const handleSwap = () => {
    const tmp = originalImage;
    setOriginalImage(modifiedImage);
    setModifiedImage(tmp);
    showToast(
      "info",
      "Swapped",
      "Original and modified images have been swapped",
    );
  };

  // Run pixelmatch whenever either image or threshold changes
  useEffect(() => {
    if (!originalImage || !modifiedImage || !diffCanvasRef.current) return;

    const canvas = diffCanvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const img1 = new Image();
    const img2 = new Image();
    let loaded = 0;

    const tryDiff = () => {
      loaded++;
      if (loaded < 2) return;

      const w = Math.max(img1.width, img2.width);
      const h = Math.max(img1.height, img2.height);

      canvas.width = w;
      canvas.height = h;

      // draw both images onto temp canvases to extract ImageData
      const c1 = document.createElement("canvas");
      const c2 = document.createElement("canvas");
      c1.width = c2.width = w;
      c1.height = c2.height = h;

      c1.getContext("2d")!.drawImage(img1, 0, 0);
      c2.getContext("2d")!.drawImage(img2, 0, 0);

      const d1 = c1.getContext("2d")!.getImageData(0, 0, w, h);
      const d2 = c2.getContext("2d")!.getImageData(0, 0, w, h);
      const diffData = ctx.createImageData(w, h);

      const mismatch = pixelmatch(d1.data, d2.data, diffData.data, w, h, {
        threshold: imageDiffThreshold,
        includeAA: false,
      });

      ctx.putImageData(diffData, 0, 0);
      diffPixelCountRef.current = mismatch;
    };

    img1.onload = tryDiff;
    img2.onload = tryDiff;
    img1.src = originalImage;
    img2.src = modifiedImage;
  }, [originalImage, modifiedImage, imageDiffThreshold]);

  const hasBothImages = !!originalImage && !!modifiedImage;

  const DropZone = ({
    target,
    src,
    label,
  }: {
    target: "original" | "modified";
    src: string | null;
    label: string;
  }) => (
    <div className="flex-1 min-h-0 flex flex-col gap-1.5">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-widest text-neutral-content font-content">
          {label}
        </span>
        {src && (
          <button
            type="button"
            onClick={() =>
              target === "original"
                ? setOriginalImage(null)
                : setModifiedImage(null)
            }
            className="text-neutral-content hover:text-rose-400 transition-colors duration-150"
            aria-label={`Remove ${label}`}
          >
            <X size={14} />
          </button>
        )}
      </div>

      <label
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => handleDrop(e, target)}
        className={`flex-1 min-h-[180px] relative flex flex-col items-center justify-center
                   rounded-2xl border-2 cursor-pointer overflow-hidden
                   transition-colors duration-150
                   ${
                     src
                       ? "border-neutral bg-base-300"
                       : "border-dashed border-neutral bg-base-200 hover:border-primary hover:bg-base-300"
                   }`}
      >
        <input
          type="file"
          accept="image/*"
          className="sr-only"
          onChange={(e) => handleFileInput(e, target)}
        />
        {src ? (
          <img
            src={src}
            alt={label}
            className="max-w-full max-h-full object-contain"
          />
        ) : (
          <div className="flex flex-col items-center gap-2 pointer-events-none">
            <Upload size={24} className="text-neutral-content" />
            <p className="text-sm text-neutral-content font-content text-center px-4">
              Drop an image or click to upload
            </p>
          </div>
        )}
      </label>
    </div>
  );

  return (
    <div className="w-full h-full flex flex-col px-3 md:px-4 pb-3 md:pb-4 gap-3">
      {/* Controls */}
      <div className="shrink-0 flex flex-wrap items-center gap-2">
        <div className="flex items-center gap-2">
          <span className="text-xs text-neutral-content font-content">
            Sensitivity
          </span>
          <div className="w-28">
            <Slider
              value={imageDiffThreshold * 100}
              onChange={(e) => setImageDiffThreshold((e.value as number) / 100)}
              min={0}
              max={100}
              className="w-full"
            />
          </div>
          <span className="text-xs tabular-nums text-neutral-content font-content w-8">
            {Math.round(imageDiffThreshold * 100)}%
          </span>
        </div>

        <div className="flex-1" />

        <Button
          type="button"
          disabled={!originalImage && !modifiedImage}
          aria-label="Swap images"
          title="Swap Original ↔ Modified"
          className="h-9 w-9 bg-transparent border border-neutral rounded-full
                     text-neutral-content
                     disabled:opacity-40 disabled:cursor-not-allowed
                     active:scale-95 transition-transform duration-100"
          onClick={handleSwap}
        >
          <ArrowLeftRight size={14} />
        </Button>

        <Button
          type="button"
          disabled={!hasBothImages}
          aria-label="Download diff image"
          title="Download diff image"
          className="h-9 w-9 bg-transparent border border-neutral rounded-full
                     text-neutral-content
                     disabled:opacity-40 disabled:cursor-not-allowed
                     active:scale-95 transition-transform duration-100"
          onClick={() =>
            diffCanvasRef.current &&
            triggerImageDiffDownload(diffCanvasRef.current)
          }
        >
          <Download size={14} />
        </Button>
      </div>

      {/* Upload zones */}
      <div className="flex-1 min-h-0 flex flex-col md:flex-row gap-3">
        <DropZone target="original" src={originalImage} label="Original" />
        <DropZone target="modified" src={modifiedImage} label="Modified" />

        {/* Diff output */}
        <div className="flex-1 min-h-0 flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-widest text-neutral-content font-content">
              Diff
            </span>
            {hasBothImages && (
              <span className="text-xs tabular-nums font-content text-neutral-content">
                {diffPixelCountRef.current.toLocaleString()} px differ
              </span>
            )}
          </div>

          <div
            className={`flex-1 min-h-[180px] flex items-center justify-center
                       rounded-2xl border-2 border-neutral overflow-hidden
                       bg-base-300 border-l-[3px] border-l-primary`}
          >
            {hasBothImages ? (
              <canvas
                ref={diffCanvasRef}
                className="max-w-full max-h-full object-contain"
              />
            ) : (
              <p className="text-sm text-neutral-content font-content">
                Upload both images to see diff
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageDiff;
