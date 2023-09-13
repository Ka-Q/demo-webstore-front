import { useEffect, useState} from "react"
import { Image, Card } from "react-bootstrap"

import './ImageViewer.css';

// Maps the list of preview images for ImageViewerComponent
const mapImageToPreviews = (imageList, path, clickedPic, setClickedPic) => {
    let previewList = imageList.map((n, index) => {
        n.index = index
        if (clickedPic.image_id == n.image_id){
            return (
                <div className="mx-1 carousel-preview-image" id={"previewPic" + index} key={"previewPic" + n.image_id} >
                    <Image src={path + n.image_source} height={"100%"}/>
                </div>
            )
        }
        return (
            <div className="mx-1 carousel-preview-image" id={"previewPic" + index} key={"previewPic" + n.image_id} onClick={() => setClickedPic(n)}>
                <div className="carousel-preview-inactive-filter">
                    <Image src={path + n.image_source} height={"100%"}/>
                </div>
            </div>
        )
    });
    return previewList
}

// Component for viewing Images. Buttons and a scrollbar for navigating between the images.
const ImageViewerComponent = (props) => {

    const [clickedPic, setClickedPic] = useState(props.images[0]);
    const imageList = props.images;

    if (!props.images || props.images.length == 0) return (
        <Card border="secondary" style={{backgroundColor: "rgb(50,50,50)", color: "white"}}>
            No images
        </Card>
    )

    // Mapping to previews
    let previewList = mapImageToPreviews(imageList, props.path, clickedPic, setClickedPic)

    // Scrolls the previews until chosen picture comes to view. "dir" is direction
    const scrollToPreview = (dir) => {
        let preview = document.getElementById("previewPic" + clickedPic.index)
        if (dir > 0) {
            preview.scrollIntoView({
                behavior: "smooth",
                inline: "start",
                block: "nearest"
            })
        } else {
            preview.scrollIntoView({
                behavior: "smooth",
                inline: "end",
                block: "nearest"
            })
        }
    }

    // Asettavat valitun kuvan ja kelaavat pikkukuvia nappeja painettaessa eteen tai taakse
    const handleIncrease = () => {
        if (clickedPic.index < imageList.length - 1) setClickedPic(imageList[clickedPic.index + 1])
        scrollToPreview(1)
    }
    const handleDecrease = () => {
        if (clickedPic.index > 0) setClickedPic(imageList[clickedPic.index - 1])
        scrollToPreview(-1)
    }

    return(
        <Card className="p-2" style={{backgroundColor: "rgb(20,20,20)", border: "2px solid rgb(40,40,40)", color: "white"}}>
            <div style={{height: "30em", position: "relative"}}>
                <a onClick={(e) => window.open(props.path + clickedPic.image_source, '_blank').focus()} style={{}}>
                    <Image className="carousel-image" fluid src={props.path + clickedPic.image_source}/>
                </a>
                <div className="ms-4 text-center carousel-btn carousel-btn-left" onClick={() => handleDecrease()}><div style={{scale: "2", pointerEvents: "none"}}>{"←"}</div></div>
                <div className="me-4 text-center carousel-btn carousel-btn-right" onClick={() => handleIncrease()}><div style={{scale: "2", pointerEvents: "none"}}>{"→"}</div></div>
            </div>
            <div id="previewScroll" className="pt-2 carousel-preview">
                {previewList}
            </div>
        </Card>

    )
}

export { ImageViewerComponent }