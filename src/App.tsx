import React from 'react'
import './App.css';
import ImageCrop from './ImageCrop';
import paper from "./paper.jpg";

function App() {
    return (
        <div>
            <ImageCrop
                imgSrc={paper}
                onSaveClick={(newImgSrc) => {
                    console.log("cropped image", newImgSrc)
                }}
            />
        </div>
    )
}

export default App;
