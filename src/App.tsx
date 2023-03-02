import { useState } from 'react'
import './App.css';
import Camera from './Camera';

function App() {
    const [imgSrc, setImgSrc] = useState<string>("");

    return (
        <div className="App">
            <Camera
                captureBtn = {
                    <button>capture</button>
                }
                onCaptureClick={(e: any) => {
                    const imgUrl = URL.createObjectURL(e);
                    setImgSrc(imgUrl)
                    console.log("imgUrl", imgUrl)
                }}
            />
            <img src={imgSrc} />
        </div>
    )
}

export default App
