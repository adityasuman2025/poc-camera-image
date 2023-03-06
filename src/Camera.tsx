import React, { useRef, useEffect, ReactNode, useState } from 'react';

const CAMERA_VIEW_DEFAULT_WIDTH = 560, CAMERA_VIEW_DEFAULT_HEIGHT = 373;
const IMG_DIM = 48;

interface CameraProps {
    cameraViewWidth?: number,
    cameraViewHeight?: number,
    captureBtnContClassName?: string,
    captureBtn?: string | ReactNode,
    onSubmitClick: (images: { [key: string]: any }[]) => void,
}
export default function Camera({
    cameraViewWidth = CAMERA_VIEW_DEFAULT_WIDTH,
    cameraViewHeight = CAMERA_VIEW_DEFAULT_HEIGHT,
    captureBtnContClassName = "",
    captureBtn = "",
    onSubmitClick,
}: CameraProps) {
    const cameraViewRef: any = useRef<any>();
    const [images, setImages] = useState<{ [key: string]: any }[]>([]);
    const [isCameraActive, setIsCameraActive] = useState<boolean>(false);

    useEffect(() => {
        (async () => {
            try {
                const cameraDevices = await navigator.mediaDevices.enumerateDevices();
                cameraDevices.forEach((device: any) => {
                    console.log("device", device.label);
                    setDevice(device);
                });
            } catch { };
        })();

        return () => {
            // release the memory used by image url created by createObjectURL()
            images.forEach(image => URL.revokeObjectURL(image.imgUrl));
        }
    }, []);

    async function setDevice(device: any) {
        const { deviceId } = device || {};
        const stream = await navigator.mediaDevices.getUserMedia({ audio: false, video: { deviceId } });

        setIsCameraActive(true);
        cameraViewRef.current.srcObject = stream;
        cameraViewRef.current.play();
    }

    function handleCaptureClick() {
        const canvasEle: HTMLCanvasElement = document.createElement("canvas");
        canvasEle.width = cameraViewWidth;
        canvasEle.height = cameraViewHeight;

        const ctx: any = canvasEle.getContext('2d');
        ctx.drawImage(cameraViewRef.current, 0, 0, cameraViewWidth, cameraViewHeight);
        canvasEle.toBlob(function (e: any) {
            const imgUrl = URL.createObjectURL(e);
            setImages(prev => ([...prev, { imgUrl }]));
        });
    }

    return (
        <>
            {
                isCameraActive ?

                    <div className='cameraComp'>
                        <video
                            ref={cameraViewRef}
                            width={cameraViewWidth || CAMERA_VIEW_DEFAULT_WIDTH}
                            height={cameraViewHeight || CAMERA_VIEW_DEFAULT_HEIGHT}
                        />

                        <div className='footer'>
                            {
                                images.length ?
                                    <>
                                        {
                                            images.map((img, idx) => (
                                                <img
                                                    key={idx}
                                                    className='thumbImg'
                                                    src={img.imgUrl}
                                                    width={IMG_DIM}
                                                    height={IMG_DIM}
                                                    style={{ left: idx * IMG_DIM / 2 }}
                                                />
                                            ))
                                        }
                                        <div className='imgThumbCount' style={{ left: images.length * IMG_DIM / 2 }}>{images.length}</div>
                                    </>
                                    : null
                            }

                            <div className='footerItem'></div>
                            <div className='footerItem'>
                                <div
                                    role='button'
                                    onClick={handleCaptureClick}
                                    className={`${captureBtnContClassName}`}
                                >
                                    {captureBtn || "capture"}
                                </div>
                            </div>
                            <div className='footerItem'>
                                <button onClick={() => { onSubmitClick && onSubmitClick(images) }}>submit</button>
                            </div>
                        </div>
                    </div>
                    : <div>Allow camera & microphone access</div>
            }
        </>
    );
}