import React, { useRef, useEffect, ReactNode } from 'react';

const CAMERA_VIEW_DEFAULT_WIDTH = 560, CAMERA_VIEW_DEFAULT_HEIGHT = 373;
interface CameraProps {
    cameraViewWidth?: number,
    cameraViewHeight?: number,
    captureBtnContClassName?: string,
    captureBtn?: string | ReactNode,
    onCaptureClick?: (imgData: any) => void
}
export default function Camera({
    cameraViewWidth = CAMERA_VIEW_DEFAULT_WIDTH,
    cameraViewHeight = CAMERA_VIEW_DEFAULT_HEIGHT,
    captureBtnContClassName = "",
    captureBtn = "",
    onCaptureClick,
}: CameraProps) {
    const cameraViewRef: any = useRef();

    useEffect(() => {
        (async () => {
            try {
                const cameraDevices = await navigator.mediaDevices.enumerateDevices();
                cameraDevices.forEach((device: any) => {
                    console.log("device", device.label);
                    setDevice(device);
                });
            } catch { }
        })();
    }, []);

    async function setDevice(device: any) {
        const { deviceId } = device || {};
        const stream = await navigator.mediaDevices.getUserMedia({ audio: false, video: { deviceId } });
        cameraViewRef.current.srcObject = stream;
        cameraViewRef.current.play();
    }

    function handleCaptureClick() {
        const canvasEle: HTMLCanvasElement = document.createElement("canvas");
        canvasEle.width = cameraViewWidth;
        canvasEle.height = cameraViewHeight;

        const ctx: any = canvasEle.getContext('2d');
        ctx.drawImage(cameraViewRef.current, 0, 0, cameraViewWidth, cameraViewHeight);
        onCaptureClick && canvasEle.toBlob(onCaptureClick);
    }

    return (
        <>
            <video
                ref={cameraViewRef}
                width={cameraViewWidth || CAMERA_VIEW_DEFAULT_WIDTH}
                height={cameraViewHeight || CAMERA_VIEW_DEFAULT_HEIGHT}
            />

            <div
                role='button'
                onClick={handleCaptureClick}
                className={captureBtnContClassName}
            >
                {captureBtn || "capture"}
            </div>
        </>
    );
}