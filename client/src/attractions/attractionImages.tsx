import { useEffect, useRef, useState } from "react";
import { Button, Card, Carousel, CarouselItem, Col, Form, InputGroup, Modal, Row } from "react-bootstrap";
import { backendServer, imageExists } from "../helpers";
import Gallery from "react-photo-gallery";
import Axios from "axios";

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
    const [imagesCount, setImagesCount] = useState(0)
    const dataFetchedRef = useRef(false)
    function getImageDimension(url: string, getdims: (height: number, width: number) => void) {
        const img = new Image();
        img.src = url;
        img.onload = function () {
            getdims(img.height, img.width)
        }
    }

    useEffect(() => {
        Axios.get(backendServer(`/attractions/${props.attractionID}/photos/count`)).then((res) => {
            setImagesCount(res.data.count)
        })

    }, [])

    useEffect(() =>  {
        console.log(imagesCount)
        if(dataFetchedRef.current) {
            return;
        }
        dataFetchedRef.current = true;
        for (let i = 0; i < imagesCount; i++) {
            let url = backendServer(`/attractions/${props.attractionID}/photos?id=${i}`)
            getImageDimension(url, function (height, width) {
                if(!images.map((val) => {return(val.src)} ).includes(url)) {
                    setImages(current => [...current, { src: url, width: width / 100, height: height / 100}])
                }
            })
        }
    }, [imagesCount])

    return (
        <div>
            {images.length === 0 ?  <i>No images available for this attraction. Be the first one to add an image! </i> :  <Gallery photos={images} />}
        </div>

    )
}