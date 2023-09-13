import { useEffect, useState} from "react"
import { Image, Card } from "react-bootstrap"

// Maps the list of preview images for ImageViewerComponent
const mapImageToPreviews = (list, kuvaSrc, clickedPic, setClickedPic) => {
    let previewList = list.map((n, index) => {
        n.index = index
        if (clickedPic.image_id == n.image_id){
            return (
                <div id={"previewPic" + index} className="mx-1" key={"previewPic" + n.image_id} style={{display:"inline-block", overflow: "auto", whiteSpace: "nowrap", height: "6em", borderRadius: "0.3em", minWidth:"4em", backgroundColor: "black"}}>
                    <Image src={kuvaSrc + n.image_source} height={"100%"}/>
                </div>
            )
        }
        return (
            <div id={"previewPic" + index} className="mx-1" key={"previewPic" + n.image_id} onClick={(e) => setClickedPic(n)} style={{position: "relative", display:"inline-block", overflow: "auto", whiteSpace: "nowrap", height: "6em" , borderRadius: "0.3em"}}>
                <div style={{display: "block", overflow: "auto", whiteSpace: "nowrap", height: "100%", filter: "brightness(0.4)", margin: 0, padding: 0, minWidth:"4em", backgroundColor: "black"}}>
                    <Image src={kuvaSrc + n.image_source} height={"100%"}/>
                </div>
            </div>
        )
    });
    return previewList
}

// Component for viewing Images. Buttons and a scrollbar for navigating between the images.
const ImageViewerComponent = (props) => {

    const [clickedPic, setClickedPic] = useState(props.images[0]);
    const [imageList, setImageList] = useState(props.images);

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

    // Styling
    let btnStyle = {backgroundColor: "rgba(40,40,40,0.8)", width:"4em", height: "4em", borderRadius: "1em", padding: "1em", cursor: "pointer", userSelect: "none", fontWeight: "bold", position: "absolute", top: "20em"}
    let BtnStyleLeft = JSON.parse(JSON.stringify(btnStyle)); BtnStyleLeft.left = 0
    let BtnStyleRight = JSON.parse(JSON.stringify(btnStyle)); BtnStyleRight.right = 0

    return(
        <Card className="p-2" style={{backgroundColor: "rgb(20,20,20)", border: "2px solid rgb(40,40,40)", color: "white"}}>
            <div style={{height: "30em"}}>
            <a onClick={(e) => window.open(props.path + clickedPic.valokuva, '_blank').focus()} style={{cursor:"pointer"}}>
                <Image src={props.path + clickedPic.image_source} fluid style={{flexShrink: 0, objectFit: "contain", height:"100%", minWidth: "100%", backgroundColor: "black", borderRadius: "0.3em"}}/>
            </a>
                <div className="ms-4" style={BtnStyleLeft} onClick={(e) => handleDecrease()}>{"<"}</div>
                <div className="me-4" style={BtnStyleRight} onClick={(e) => handleIncrease()}>{">"}</div>
            </div>
            <div id="previewScroll" className="pt-2" style={{display:"inline-block", overflow: "auto", whiteSpace: "nowrap", width: "100%", height: "auto", userSelect: "none"}} >
                {previewList}
            </div>
        </Card>

    )
}

export { ImageViewerComponent }