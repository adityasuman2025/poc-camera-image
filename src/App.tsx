import React from 'react'
import './App.css';
import Camera from './Camera';

function App() {
    return (
        <Camera
            captureBtn={
                <button>capture</button>
            }
            onSubmitClick={(imgs) => console.log("imgs", imgs)}
        />
    )
}

export default App;
