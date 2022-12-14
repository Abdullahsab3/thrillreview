import { useEffect, useState } from "react";
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
    function getImageDimension(url: string ,getdims: (height: number, width: number) => void) {
        const img = new Image();
        img.src = url;
        img.onload = function () {
            getdims(img.height, img.width)
        }
    }

    useEffect(() => {
        let newimages: imageinfo[] = []
        for (let i = 0; i < 5; i++) {
            let url = backendServer(`/attractions/${props.attractionID}/photos?id=${i}`)
            if (imageExists(url)) {
                getImageDimension(url, function (height, width) {

                newimages.push({ src: url, width: width, height:  height})

                })

            }
        }
        setImages(newimages)
    }, [])

    return (
        <Gallery photos={images} />
        
    )
}