import { Form, InputGroup } from "react-bootstrap";

interface inputField {
    onChange: React.ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>,
    value: string
    required?: boolean | undefined;
}

function NameInputField(props: inputField) {
    return (

        <Form.Group>
            <Form.Control required={props.required} type="text" onChange={props.onChange} value={props.value}/>
        </Form.Group>
    )
}

function ThemeparkInputField(props: inputField) {
    return (<Form.Group>
        <Form.Control required={props.required} type="text" onChange={props.onChange} value={props.value}/>
    </Form.Group>)
}

function OpeningInputField(props: inputField) {

    return (<Form.Group>
        <Form.Control type="date" onChange={props.onChange} value={props.value}/>
    </Form.Group>)
}

function BuilderInputField(props: inputField) {
    return (

        <Form.Group>
            <Form.Control type="text" onChange={props.onChange} value={props.value}/>
        </Form.Group>
    )
}

function TypesInputField(props: inputField) {
    return (

        <Form.Group id="attraction-types">
            <div className='attraction-type-options'>
                <InputGroup className="attraction-type-option"><Form.Check label="flat ride" /> </InputGroup>
                <InputGroup className="attraction-type-option"><Form.Check label="steel coaster" /> </InputGroup>
                <InputGroup className="attraction-type-option"><Form.Check label="wooden coaster" /> </InputGroup>
                <InputGroup className="attraction-type-option"><Form.Check label="standing coaster" /> </InputGroup>
                <InputGroup className="attraction-type-option"><Form.Check label="sitdown coaster" /> </InputGroup>
                <InputGroup className="attraction-type-option"><Form.Check label="launch coaster" /> </InputGroup>
            </div>
        </Form.Group>
    )
}

function LengthInputField(props: inputField) {
    return (

        <Form.Group>
            <Form.Control type="text" pattern="[0-9]*?(:[.|,][0-9]*)?" placeholder="13,13" onChange={props.onChange} value={props.value}/>
            <Form.Control.Feedback type="invalid">
                The attraction's length should consist of only numbers (you can write decimals by using . or ,).
            </Form.Control.Feedback>
        </Form.Group>

    )
}

function HeightInputField(props: inputField) {
    return (

        <Form.Group>
            <Form.Control type="text" pattern="[0-9]*?(:[.|,][0-9]*)?" placeholder="13,13" onChange={props.onChange} value={props.value}/>
            <Form.Control.Feedback type="invalid">
                The attraction's height should consist of only numbers (you can write decimals by using . or ,).
            </Form.Control.Feedback>
        </Form.Group>
    )
}

function InversionsInputField(props: inputField) {
    return (

        <Form.Group>
            <Form.Control type="number" min="0" onChange={props.onChange} value={props.value}/>
        </Form.Group>
    )
}

function DurationInputField(props: inputField) {
    return (

        <Form.Group>
            <Form.Control type="duration" pattern="[0-9]{2}:[0-5][0-9]:[0-5][0-9]" placeholder="hh:mm:ss" onChange={props.onChange} value={props.value}/>
            <Form.Control.Feedback type="invalid">
                The attraction's duration should be in terms of hours, minutes and seconds (you can write it like this: 99:59:59).
            </Form.Control.Feedback>
        </Form.Group>
    )
}
export {
    NameInputField, DurationInputField, InversionsInputField, HeightInputField, LengthInputField, TypesInputField,
    BuilderInputField, OpeningInputField, ThemeparkInputField
}
