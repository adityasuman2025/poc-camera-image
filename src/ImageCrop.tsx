import React, { useState, useEffect, useRef, DependencyList } from 'react'
import ReactCrop, { Crop, PixelCrop } from 'react-image-crop'
import 'react-image-crop/dist/ReactCrop.css'

const TO_RADIANS = Math.PI / 180;

//ref: https://codesandbox.io/s/react-image-crop-demo-with-react-hooks-y831o
export function useDebounceEffect(
    fn: () => void,
    waitTime: number,
    deps: DependencyList,
) {
    useEffect(() => {
        const t = setTimeout(() => {
            //@ts-ignore
            fn.apply(undefined, deps)
        }, waitTime)

        return () => { clearTimeout(t); }
    }, deps)
}

export async function canvasPreview(
    image: HTMLImageElement,
    canvas: HTMLCanvasElement,
    crop: PixelCrop,
    scale = 1,
    rotate = 0,
) {
    const ctx = canvas.getContext('2d')

    if (!ctx) return;

    const scaleX = image.naturalWidth / image.width
    const scaleY = image.naturalHeight / image.height
    // devicePixelRatio slightly increases sharpness on retina devices
    // at the expense of slightly slower render times and needing to
    // size the image back down if you want to download/upload and be
    // true to the images natural size.
    const pixelRatio = window.devicePixelRatio

    canvas.width = Math.floor(crop.width * scaleX * pixelRatio)
    canvas.height = Math.floor(crop.height * scaleY * pixelRatio)

    ctx.scale(pixelRatio, pixelRatio)
    ctx.imageSmoothingQuality = 'high'

    const cropX = crop.x * scaleX
    const cropY = crop.y * scaleY

    const rotateRads = rotate * TO_RADIANS
    const centerX = image.naturalWidth / 2
    const centerY = image.naturalHeight / 2

    ctx.save()

    // 5) Move the crop origin to the canvas origin (0,0)
    ctx.translate(-cropX, -cropY)
    // 4) Move the origin to the center of the original position
    ctx.translate(centerX, centerY)
    // 3) Rotate around the origin
    ctx.rotate(rotateRads)
    // 2) Scale the image
    ctx.scale(scale, scale)
    // 1) Move the center of the image to the origin (0,0)
    ctx.translate(-centerX, -centerY)
    ctx.drawImage(image, 0, 0, image.naturalWidth, image.naturalHeight, 0, 0, image.naturalWidth, image.naturalHeight);

    ctx.restore();
}

export default function ImageCrop({
    imgSrc = "",
    onSaveClick,
}: {
    imgSrc: string,
    onSaveClick: (newImgSrc: string) => void,
}) {
    const previewCanvasRef = useRef<HTMLCanvasElement>(null);
    const imgRef = useRef<HTMLImageElement>(null);
    const blobUrlRef = useRef<string>('');

    const [crop, setCrop] = useState<Crop>()
    const [completedCrop, setCompletedCrop] = useState<PixelCrop>();

    function handleSaveClick() {
        if (!previewCanvasRef.current) return;

        previewCanvasRef.current.toBlob((blob) => {
            if (!blob) return;
            if (blobUrlRef.current) URL.revokeObjectURL(blobUrlRef.current);

            const newImgSrc = URL.createObjectURL(blob);
            blobUrlRef.current = newImgSrc

            onSaveClick && onSaveClick(newImgSrc);
        })
    }

    useDebounceEffect(
        async () => {
            if (completedCrop?.width && completedCrop?.height && imgRef.current && previewCanvasRef.current) {
                // We use canvasPreview as it's much faster than imgPreview.
                canvasPreview(imgRef.current, previewCanvasRef.current, completedCrop);
            }
        }, 100, [completedCrop]
    )

    return (
        <div className="App">
            {!!imgSrc && (
                <ReactCrop
                    crop={crop} aspect={undefined}
                    onChange={(_, percentCrop) => setCrop(percentCrop)}
                    onComplete={(c) => setCompletedCrop(c)}
                >
                    <img ref={imgRef} alt="Crop me" src={imgSrc} />
                </ReactCrop>
            )}
            <br />

            {!!completedCrop && (
                <>
                    <canvas
                        ref={previewCanvasRef}
                        style={{ display: "none", width: completedCrop.width, height: completedCrop.height }}
                    />
                    <button onClick={handleSaveClick}>Save</button>
                </>
            )}
        </div>
    )
}