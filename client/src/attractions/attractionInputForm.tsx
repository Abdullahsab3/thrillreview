import { FormEventHandler, useEffect, useState } from "react";
import { Button, Card, Carousel, CarouselItem, Col, Form, InputGroup, Modal, Row } from "react-bootstrap";
import { Attraction } from "./Attraction";

interface AttractionInputProps {
    title: string;
    text: string;
    attraction?: Attraction;
    onFormSubmit: (a: Attraction) => FormEventHandler<HTMLFormElement>;
    validated: boolean;

}
export default function AttractionInputForm(props: AttractionInputProps) {

    const maxImageUploads = 5;

    const [name, setName] = useState("")
    const [themepark, setThemepark] = useState("")
    const [openingdate, setOpeningdate] = useState("")
    const [builder, setBuilder] = useState("")
    const [type, setType] = useState("")
    const [height, setHeight] = useState("")
    const [length, setLength] = useState("")
    const [inversions, setInversions] = useState("")
    const [duration, setDuration] = useState("")
    const [allImages, setAllImages] = useState<File[]>([]);
    const [reachedImgLimit, setReachedImgLimit] = useState(false);
    const [imagesSelected, setImagesSelected] = useState(false);

    useEffect(() => {
        if(props.attraction) {
            setName(props.attraction.name)
            setThemepark(props.attraction.themepark)
            setOpeningdate(props.attraction.openingdate)
            setBuilder(props.attraction.builder)
            setType(props.attraction.type)
            setHeight(props.attraction.height)
            setLength(props.attraction.length)
            setInversions(props.attraction.inversions)
            setDuration(props.attraction.duration)
        }


    }, [])

    function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
        const alreadyUploaded = allImages;
        const newUploads = e.target.files;
        if (newUploads) {
            const nronewUploads = newUploads.length
            for (let i = 0; !reachedImgLimit && i < nronewUploads; i++) {
                alreadyUploaded.push(newUploads[i])
                if (alreadyUploaded.length >= maxImageUploads) {
                    alert(`You can only upload ${maxImageUploads} pictures`);
                    setReachedImgLimit(true);
                    break;
                }
            }
            setAllImages(alreadyUploaded)
            setImagesSelected(true)
            console.log(allImages)
        }
    }

    function ShowImages() {
        const [showing, setShowing] = useState(false)
        return (
            <div id="popUpImageShowing">
                <Button onClick={(e) => setShowing(true)} disabled={!imagesSelected}>See Images</Button>
                <Modal show={showing} onHide={() => setShowing(false)}>
                    <Modal.Header closeButton> The images you uploaded</Modal.Header>
                    <Modal.Body>
                        <Carousel>
                            {
                                allImages.map((v) => <CarouselItem key={v.name}> <img width="500px" height="500px" className="attractionImage" src={URL.createObjectURL(v)} alt="attraction image"></img></CarouselItem>)
                            }
                        </Carousel>
                    </Modal.Body>
                </Modal>
            </div>
        )
    }

    function getId() {
        if(props.attraction) {
            return props.attraction.id
        } else return 0
    }


    return (
        <div className="ContentOfPage">
            <Card>
                <Card.Body>
                    <Card.Title>{props.title}</Card.Title>
                    <Card.Text>{props.text}</Card.Text>
                    <Form className="align-items-center"
                        validated={props.validated}
                        onSubmit={props.onFormSubmit(new Attraction(name, themepark, openingdate, builder, type, height, length, inversions, duration, getId()))}>
                        <Row>
                            <Col>
                                <Form.Group>
                                    <Button id="button-overlay">
                                        Upload Images
                                        <Form.Control type="file" id="imgUpload" accept=".jpeg, .png, .jpg" multiple onChange={handleImageUpload} disabled={reachedImgLimit} />
                                    </Button>
                                </Form.Group>
                            </Col>
                            <Col>
                                <ShowImages />
                            </Col>
                        </Row>
                        <Row lg={2} sm={1}>
                            <Col>
                                <Form.Group>
                                    <Form.Label> Name* </Form.Label>
                                    <Form.Control required type="text" onChange={(e) => setName(e.target.value)} value={name} />
                                    <Form.Control.Feedback type="invalid">
                                        Name is required
                                    </Form.Control.Feedback>
                                </Form.Group>
                            </Col>
                            <Col>
                                <Form.Group>
                                    <Form.Label>Theme park*</Form.Label>
                                    <Form.Control required type="text" onChange={(e) => setThemepark(e.target.value)} value={themepark} />
                                    <Form.Control.Feedback type="invalid">
                                        Theme park is required
                                    </Form.Control.Feedback>
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row lg={2} sm={1}>
                            <Col>
                                <Form.Group>
                                    <Form.Label>Opening</Form.Label>
                                    <Form.Control type="date" onChange={(e) => setOpeningdate(e.target.value)} value={openingdate} />
                                </Form.Group>
                            </Col>
                            <Col>
                                <Form.Group>
                                    <Form.Label>Builder</Form.Label>
                                    <Form.Control type="text" onChange={(e) => setBuilder(e.target.value)} value={builder} />
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <Form.Group id="attraction-types">
                                    <Form.Label >Type</Form.Label>
                                    <div className='attraction-type-options'>
                                        <InputGroup className="attraction-type-option"><Form.Check label="flat ride" /> </InputGroup>
                                        <InputGroup className="attraction-type-option"><Form.Check label="steel coaster" /> </InputGroup>
                                        <InputGroup className="attraction-type-option"><Form.Check label="wooden coaster" /> </InputGroup>
                                        <InputGroup className="attraction-type-option"><Form.Check label="standing coaster" /> </InputGroup>
                                        <InputGroup className="attraction-type-option"><Form.Check label="sitdown coaster" /> </InputGroup>
                                        <InputGroup className="attraction-type-option"><Form.Check label="launch coaster" /> </InputGroup>
                                    </div>
                                </Form.Group>
                            </Col>
                            <Col>
                                <Row>
                                    <Form.Group>
                                        <Form.Label>Length</Form.Label>
                                        <Form.Control type="text" pattern="[0-9]*([.|,][0-9]*)?" placeholder="13,13" onChange={(e) => setLength(e.target.value)} value={length} />
                                        <Form.Control.Feedback type="invalid">
                                            The attraction's length should consist of only numbers (you can write decimals by using . or ,).
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                </Row>
                                <Row>
                                    <Form.Group>
                                        <Form.Label>Height </Form.Label>
                                        <Form.Control type="text" pattern="[0-9]*([.|,][0-9]*)?" placeholder="13,13" onChange={(e) => setHeight(e.target.value)} value={height} />
                                        <Form.Control.Feedback type="invalid">
                                            The attraction's height should consist of only numbers (you can write decimals by using . or ,).
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                </Row>
                            </Col>
                        </Row>
                        <Row lg={2} sm={1}>
                            <Col>
                                <Form.Group>
                                    <Form.Label>Inversions </Form.Label>
                                    <Form.Control type="number" min="0" onChange={(e) => setInversions(e.target.value)} value={inversions} />
                                </Form.Group>
                            </Col>
                            <Col>
                                <Form.Group>
                                    <Form.Label>Duration</Form.Label>
                                    <Form.Control type="text" pattern="[0-5][0-9]:[0-5][0-9]" placeholder="mm:ss" onChange={(e) => setDuration(e.target.value)} value={duration} />
                                    <Form.Control.Feedback type="invalid">
                                        The attraction's duration should be in terms of minutes and seconds (you can write it like this: 59:59).
                                    </Form.Control.Feedback>
                                </Form.Group>
                            </Col>
                        </Row>
                        <Button type="submit">Submit</Button>
                    </Form>
                </Card.Body>
            </Card>
        </div>
    )
}