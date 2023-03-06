import React, { useState, useRef, useCallback } from 'react'
import './App.css';
import Camera from './Camera';
import Cropper from './Cropper';

const App = () => {
    const [cropState, setCropState] = useState<any>()
    const [img, setImg] = useState<any>()
    const [inputKey, setInputKey] = useState<any>(0)
    const cropperRef = useRef<any>()

    const onDragStop = useCallback((s: any) => setCropState(s), [])
    const onChange = useCallback((s: any) => setCropState(s), [])

    const doSomething = async () => {
        console.log(cropState)
        try {
            const res = await cropperRef.current.done({ preview: true })
            console.log(res)
        } catch (e) {
            console.log('error', e)
        }
    }

    const onImgSelection = async (e: any) => {
        if (e.target.files && e.target.files.length > 0) {
            // it can also be a http or base64 string for example
            setImg(e.target.files[0])
        }
    }

    return (
        <>
            <Cropper
                ref={cropperRef}
                image={img}
                onChange={onChange}
                onDragStop={onDragStop}
            />
            <input
                type='file'
                key={inputKey}
                onChange={onImgSelection}
                accept='image/*'
            />
            <button onClick={doSomething}>Ho finito</button>
        </>
    )
}


// function App() {
//     return (
//         <Camera
//             captureBtn={
//                 <button>capture</button>
//             }
//             onSubmitClick={(imgs) => console.log("imgs", imgs)}
//         />
//     )
// }

export default App
