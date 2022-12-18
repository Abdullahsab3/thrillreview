import React, { FormEventHandler, useEffect, useState } from "react";
import { Button, Card, Carousel, CarouselItem, Col, DropdownButton, Form, InputGroup, Modal, Row } from "react-bootstrap";
import { Attraction } from "./Attraction";
import ConnectThemePark from "../themeParks/connectThemeParks";


interface AttractionInputProps {
    title: string;
    text: string;
    attraction?: Attraction;
    onFormSubmit: (a: Attraction, i: File[]) => FormEventHandler<HTMLFormElement>;
    validated: boolean;

}



export default function AttractionInputForm(props: AttractionInputProps) {

    const maxImageUploads = 5;

    const [name, setName] = useState("");
    const [themepark, setThemepark] = useState("");
    const [themeparkName, setThemeparkName] = useState("Not yet chosen");
    const [themeParkSelected, setThemeParkSelected] = useState(false);
    const [openingdate, setOpeningdate] = useState("");
    const [builder, setBuilder] = useState("");
    const [type, setType] = useState<string[]>([]);
    const [height, setHeight] = useState("");
    const [length, setLength] = useState("");
    const [inversions, setInversions] = useState("");
    const [duration, setDuration] = useState("");
    const [allImages, setAllImages] = useState<File[]>([]);
    const [reachedImgLimit, setReachedImgLimit] = useState(false);
    const [imagesSelected, setImagesSelected] = useState(false);


    useEffect(() => {
        if (props.attraction) {
            setName(props.attraction.name);
            setThemepark(props.attraction.themepark);
            setThemeparkName(props.attraction.themepark);
            setThemeParkSelected(true);
            const opdate = props.attraction.openingdate;
            if (opdate) setOpeningdate(opdate);
            const bldr = props.attraction.builder;
            if (bldr) setBuilder(bldr);
            const hght = props.attraction.height;
            if (hght) setHeight(hght);
            const lngth = props.attraction.length;
            setLength(lngth)
            const invrs = props.attraction.inversions;
            if (invrs) setInversions(invrs);
            const duratn = props.attraction.duration;
            setDuration(duratn)
            const types = props.attraction.type
            if (types) setType(types.split(","));
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
        if (props.attraction) {
            return props.attraction.id
        } else return 0
    }

    function connectedThemepark(id: number, thmprk: string) {
        const mouseEventHandler: React.MouseEventHandler<HTMLElement> = (ev: React.MouseEvent) => {
            setThemepark(id.toString());
            setThemeparkName(thmprk);
            setThemeParkSelected(true);
        }
        return mouseEventHandler;
    }


    function getTypesAsString() {
        return type.toString();
    }

    function changeTypes(e: React.ChangeEvent<HTMLInputElement>) {
        const value = e.target.value;
        if (e.target.checked && !type.includes(value)) {
            // checked -> add
            setType((prev) => [...prev, value]);
        } else {
            // unchecked -> remove
            setType(type.filter((e) => {return e !== value}));
        };
    }


    return (
        <div className="ContentOfPage">
            <Card>
                <Card.Body>
                    <Card.Title>{props.title}</Card.Title>
                    <Card.Text>{props.text}</Card.Text>
                    <Form className="align-items-center"
                        validated={props.validated}
                        onSubmit={props.onFormSubmit(new Attraction(name, themepark, openingdate, builder, getTypesAsString(), height, length, inversions, duration, getId()), allImages)}>
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
                                    <InputGroup>
                                        <ConnectThemePark onClick={connectedThemepark} />
                                        <Form.Control isValid={themeParkSelected} isInvalid={!themeParkSelected} required readOnly value={themeparkName} />
                                        <Form.Control.Feedback type="invalid" >
                                            Theme park is required
                                        </Form.Control.Feedback>
                                    </InputGroup>
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
                                    <Form.Label>Type</Form.Label>
                                    <div className='attraction-type-options'>
                                        <InputGroup className="attraction-type-option"><Form.Check label="flat ride" value="flat ride" onChange={changeTypes}  defaultChecked={type.includes("flat ride")}/> </InputGroup>
                                        <InputGroup className="attraction-type-option"><Form.Check label="steel coaster" value="steel coaster" onChange={changeTypes} defaultChecked={type.includes("steel coaster")}/> </InputGroup>
                                        <InputGroup className="attraction-type-option"><Form.Check label="wooden coaster" value="wooden coaster" onChange={changeTypes} defaultChecked={type.includes("wooden coaster")}/> </InputGroup>
                                        <InputGroup className="attraction-type-option"><Form.Check label="standing coaster" value="standing coaster" onChange={changeTypes} defaultChecked={type.includes("standing coaster")}/> </InputGroup>
                                        <InputGroup className="attraction-type-option"><Form.Check label="sitdown coaster" value="sitdown coaster" onChange={changeTypes} defaultChecked={type.includes("sitdown coaster")}/> </InputGroup>
                                        <InputGroup className="attraction-type-option"><Form.Check label="launch coaster" value="launch coaster" onChange={changeTypes} defaultChecked={type.includes("launch coaster")}/> </InputGroup>
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