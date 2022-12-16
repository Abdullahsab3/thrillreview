import { useEffect, useRef, useState } from "react";
import { Button, Card, Carousel, CarouselItem, Col, Form, InputGroup, Modal, Row } from "react-bootstrap";
import { backendServer, imageExists } from "../helpers";
import Gallery from "react-photo-gallery";

interface imageProps {
    attractionID: number
}

interface imageinfo {
    src: string,
    width: number,
    height: number,
}
export default function AttractionImages(props: imageProps) {

    const [images, setImages] = useState<imageinfo[]>([])
    const dataFetchedRef = useRef(false)
    function getImageDimension(url: string, getdims: (height: number, width: number) => void) {
        const img = new Image();
        img.src = url;
        img.onload = function () {
            getdims(img.height, img.width)
        }
    }

    useEffect(() => {
        if(dataFetchedRef.current) {
            return;
        }
            dataFetchedRef.current = true;
            for (let i = 0; i < 10; i++) {
                let url = backendServer(`/attractions/${props.attractionID}/photos?id=${i}`)
                if (imageExists(url)) {
                    getImageDimension(url, function (height, width) {
                        if(!images.map((val) => {return(val.src)} ).includes(url)) {
                            setImages(current => [...current, { src: url, width: width / 100, height: height / 100}])
                        }
                    })
                } else {
                    break;
                }
            }

    }, [])

    return (
        <div>
            {images.length === 0 ?  <i>No images available for this attraction. Be the first one to add an image! </i> :  <Gallery photos={images} />}
        </div>

    )
}