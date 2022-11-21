import Axios from "axios";
import { useEffect, useState } from "react";
import { Form, InputGroup } from "react-bootstrap";
import { trackPromise, usePromiseTracker } from "react-promise-tracker";
import { backendServer } from "../helpers";
import ButtonWithLoading from "../higherOrderComponents/buttonWithLoading";
import { fetchUserFromLocalStorage } from "../localStorageProcessing";
import { User } from "../userManagement/User";
import "./styling/reviewForm.css"

interface writReviewProps {
    attractionID: string
    edit?: boolean
}
export default function WriteReview(props: writReviewProps) {
    Axios.defaults.withCredentials = true
    const user: User | null = fetchUserFromLocalStorage()


    const [review, setReview] = useState("")
    const [reviewError, setReviewError] = useState("")
    const [validated, setValidated] = useState(false)

    const { promiseInProgress } = usePromiseTracker()

    function isFormValid() {
        return review;
    }

    function checkForErrors(data: any) {
        if (data.error) {
            setReviewError(data.error.review)
            return (true)
        } else {
            return (false)
        }
    }

    function getUserReview() {
        Axios.post(backendServer("/get-review"),
            { attractionID: props.attractionID, userID: (user as User).id }).then((res) => {
                if (res) {
                    if (checkForErrors((res as any).data)) {
                        setValidated(false)
                    } else if (res.data.review) {
                        setReview(res.data.review)
                    }
                }
            }).catch((error) => {
                if (checkForErrors(error.response.data)) {
                    setValidated(false)
                }
            })
    }
    const handleUploadingReview: React.FormEventHandler<HTMLFormElement> =
        (event: React.FormEvent<HTMLFormElement>) => {
            setReviewError("");
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
                    if (checkForErrors(error.response.data)) {
                        setValidated(false)
                    }
                })
            )
        };

    useEffect(() => {
        if (props.edit) {
            getUserReview()
        }
    }, [])


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
                    value={review}
                    isInvalid={(reviewError as any)} />
                <Form.Control.Feedback type="invalid">
                    {reviewError}
                </Form.Control.Feedback>
            </InputGroup>
            <ButtonWithLoading className="submitreview" disabled={!isFormValid() || promiseInProgress} promiseInProgress={promiseInProgress} message="Post" />
        </Form>

    </div>)
}