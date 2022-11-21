
import { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';
import { StringMappingType } from 'typescript';
import { string } from 'yup';

interface buttonProps {
    disabled: boolean;
    promiseInProgress: boolean;
    message: string;
    className?: string
}
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