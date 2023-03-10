import React, { useState } from 'react'
import './App.css';
import ImageCrop from './ImageCrop';
import paper from "./paper.jpg";

function rotateImage(imageBase64: string, rotation: number, cb: (newImg: string) => void) {
    var img = new Image();
    img.src = imageBase64;

    img.onload = () => {
        var canvas = document.createElement("canvas");
        if ([90, 270].indexOf(rotation) > -1) {
            canvas.width = img.height;
            canvas.height = img.width;
        } else {
            canvas.width = img.width;
            canvas.height = img.height;
        }

        var ctx: any = canvas.getContext("2d");
        ctx.setTransform(1, 0, 0, 1, img.height / 2, img.width / 2);
        ctx.rotate(90 * (Math.PI / 180));
        ctx.drawImage(img, -img.width / 2, -img.height / 2);

        cb(canvas.toDataURL("image/jpeg"));
    };
}

export default function App() {
    const [image, setImage] = useState(paper);

    function handleRotateClick() {
        rotateImage(image, 90, function (newImage) {
            setImage(newImage);
        });
    }

    return (
        <div>
            <ImageCrop
                imgSrc={image}
                onSaveClick={(newImgSrc) => {
                    console.log("cropped image", newImgSrc)
                }}
            />

            <button onClick={handleRotateClick}>rotate</button>
        </div>
    )
}
