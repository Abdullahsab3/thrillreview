
import { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';

interface buttonProps {
    disabled: boolean;
    promiseInProgress: boolean;
    message: string;
    className?: string
}
/**
 * A button which will display loading animation while being disabled whenever PromiseInProgress is true
 * @param props
 * disabled: when the button should be disabled
 * 
 * promiseInProgress: is there a promise in progress (aka should the button show the loading animation)
 * 
 * message: the text in the button
 * 
 * className: optional className of the button.
 * @returns a button with loading animation
 */
export default function ButtonWithLoading(props: buttonProps) {
    const [className, setClassName] = useState("")

    useEffect(() => {

        if(props.className) {
            setClassName(props.className)
        } else {
            setClassName("submitbutton")
        }
    }, [])


    return (
        <Button className={className} type="submit" variant="primary" disabled={props.disabled}>
            {props.promiseInProgress ?
                <div><Spinner
                    as="span"
                    animation="grow"
                    size="sm"
                    role="status"
                    aria-hidden="true"
                /> Please wait </div> : props.message}
        </Button>
    )
}