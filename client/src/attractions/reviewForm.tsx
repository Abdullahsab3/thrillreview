import  Axios from "axios";
import { useState } from "react";
import { Form, InputGroup } from "react-bootstrap";
import { trackPromise, usePromiseTracker } from "react-promise-tracker";
import { backendServer } from "../helpers";
import ButtonWithLoading from "../higherOrderComponents/buttonWithLoading";
import "./styling/reviewForm.css"

interface writReviewProps {
    attractionID: string
}
export default function WriteReview(props: writReviewProps) {
    Axios.defaults.withCredentials = true

    
    const [review, setReview] = useState("")
    const [reviewError, setReviewError] = useState("")
    const [validated, setValidated] = useState(false)

    const { promiseInProgress } = usePromiseTracker()

    function isFormValid() {
        return review;
    }

    function checkForErrors(data: any) {
        if(data.error) {
            setReviewError(data.error.review)
            return(true)
        } else {
            return(false)
        }
    }
    const handleUploadingReview: React.FormEventHandler<HTMLFormElement> =
    (event: React.FormEvent<HTMLFormElement>) => {
        setReviewError("");
        event.preventDefault();
        event.stopPropagation();
        trackPromise(
        Axios.post(backendServer("/upload-review"), {
           attractionID: props.attractionID,
           review: review
        }).then((res) => {
            if (checkForErrors((res as any).data)) {
                setValidated(false)
            } else {
                setValidated(true)
                
            }
        }).catch(function (error) {
            console.log(error)
            if (checkForErrors(error.response.data)) {
                setValidated(false)
            }
        })
        )
    };
 

    return (<div>
        <Form noValidate validated={validated} onSubmit={handleUploadingReview} className="comment">
            <InputGroup>
                <Form.Control
                    required
                    as="textarea"
                    rows={6}
                    cols={100}
                    onChange={(e) => setReview(e.target.value)}
                    placeholder="Write a review"
                    isInvalid={(reviewError as any)} />
                <Form.Control.Feedback type="invalid">
                    {reviewError}
                </Form.Control.Feedback>
            </InputGroup>
            <ButtonWithLoading className="submitreview" disabled={!isFormValid() || promiseInProgress} promiseInProgress={promiseInProgress} message="Post" />
        </Form>

    </div>)
}