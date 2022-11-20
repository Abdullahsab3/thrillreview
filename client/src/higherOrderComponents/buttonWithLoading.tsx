
import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';

interface buttonProps {
    disabled: boolean;
    promiseInProgress: boolean;
    message: string
}
export default function ButtonWithLoading(props: buttonProps) {

    return (
        <Button className="submitbutton" type="submit" variant="primary" disabled={props.disabled}>
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