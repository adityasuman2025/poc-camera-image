import React, { ReactElement, useState } from "react";

export default function ReorderList({
    items = [],
    itemRenderer
}: {
    items: { [key: string]: any }[],
    itemRenderer: (...args: any) => ReactElement
}) {
    const [dragId, setDragId] = useState();
    const [boxes, setBoxes] = useState<{[key: string]: any}[]>(items.map((item, idx) => ({ ...item, order: idx+1 })));

    function handleDrag(ev: any) {
        setDragId(ev.currentTarget.id);
    }

    function handleDrop(ev: any) {
        const dragBox: any = boxes.find(box => box.id === dragId);
        const dropBox: any = boxes.find(box => box.id === ev.currentTarget.id);

        const dragBoxOrder = dragBox.order, dropBoxOrder = dropBox.order;

        const newBoxesState = boxes.map((box) => {
            if (box.id === dragId) box.order = dropBoxOrder;
            if (box.id === ev.currentTarget.id) box.order = dragBoxOrder;

            return box;
        })
        setBoxes(newBoxesState);
    }

    return (
        <>
            {
                boxes
                    .sort((a, b) => a.order - b.order)
                    .map((item) => itemRenderer(item, handleDrag, handleDrop))
            }
        </>
    )
}