import { useEffect, useRef, useState } from "react";
import { backendServer } from "../helpers";
import Gallery from "react-photo-gallery";
import Axios from "axios";

/**
 * The AttractionImages component needs to know the id of the attraction
 * in order to fetch its images
 */
interface imageProps {
    attractionID: number
}

/**
 * Each image has its width and height
 * in order for the react-photo-gallery to properly work.
 */
interface imageinfo {
    src: string,
    width: number,
    height: number,
}

/**
 * A gallery for the attractions
 * The component will fetch all the images from the server
 * and then display them in the gallery.
 * @param props an interface with attractionID,
 *  which is the id of the attraction of which the photos should be fetched.
 * @returns The gallery if there are images, or a message indicating there are no images.
 */
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

    /**
     * Get all the images from the server
     * @param max The maximum number of images
     */
    function constructImagesInfo(max: number) {
        for (let i = 0; i < max; i++) {
            let url = backendServer(`/attractions/${props.attractionID}/photos?id=${i}`)
            getImageDimension(url, function (height, width) {
                if(!images.map((val) => {return(val.src)} ).includes(url)) {
                    setImages(current => [...current, { src: url, width: width / 100, height: height / 100}])
                }
            })
        }
    }

    useEffect(() => {
        /**
         * First, get the count of the images for that attraction
         * which is the number of images an attraction has.
         */
        Axios.get(backendServer(`/attractions/${props.attractionID}/photos/count`)).then((res) => {
            setImagesCount(res.data.count)
        })

    }, [props.attractionID])

    /**
     * Once you have the count, fetch all the images.
     */
    useEffect(() =>  {
        if(imagesCount > 0) {
            /**
             * Only fetch the images once.
             */
            if(dataFetchedRef.current) {
                return;
            }
            constructImagesInfo(imagesCount);
            dataFetchedRef.current = true;
        }

    }, [imagesCount])

    return (
        <div>
            {images.length === 0 ?  <i>No images available for this attraction. Be the first one to add an image! </i> :  <Gallery photos={images} />}
        </div>

    )
}