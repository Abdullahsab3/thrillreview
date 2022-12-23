import Axios from "axios";
import { useEffect, useState } from "react";
import { Button, Form, InputGroup } from "react-bootstrap";
import { trackPromise, usePromiseTracker } from "react-promise-tracker";
import { backendServer } from "../helpers";
import ButtonWithLoading from "../higherOrderComponents/buttonWithLoading";
import { fetchUserFromLocalStorage } from "../localStorageProcessing";
import { User } from "../userManagement/User";
import StarRatingForm from "./starRatingForm";
import "./styling/reviewForm.css";
import { LoginFirstCard }  from '../higherOrderComponents/cardWithLinkTo';


interface writReviewProps {
    attractionID: number
    edit?: boolean
}
/**
 * Write or edit a review
 * @param props an attractionID, which is the id of the attraction for which the review is being placed, edited
 */
export default function WriteReview(props: writReviewProps) {
    const user: User | null = fetchUserFromLocalStorage()


    const [review, setReview] = useState("")
    const [rating, setRating] = useState<number | null>(null)
    const [reviewError, setReviewError] = useState("")
    const [validated, setValidated] = useState(false)
    const [notAllowed, setnotAllowed] = useState(false)

    const { promiseInProgress } = usePromiseTracker()

    function isFormValid() {
        return review && rating;
    }

    function checkForErrors(data: any) {
        if (data.error) {
            setReviewError(data.error.review)
            return (true)
        } else {
            return (false)
        }
    }

    /**
     * fetch the review from the server.
     */
    function getUserReview() {
        Axios.get(backendServer(`/attraction/${props.attractionID}/review?userid=${(user as User).id}`))
        .then((res) => {
            setReview(res.data.review)
            if (props.edit) {
                setnotAllowed(false)
            } else {
                setnotAllowed(true)
            }
            
            }).catch((error) => {
                /**
                 * If there are any errors, disable the validation,
                 * and display the error
                 */
                if(error.status === 404) {
                    setValidated(false)
                } else {
                if (checkForErrors(error.response.data)) {
                    setValidated(false)
                }
            }
            })
    }

    /**
     * Post a review to the server
     * This could be either a new review, or updating an old review of the user.
     */
    const handleUploadingReview: React.FormEventHandler<HTMLFormElement> =
        (event: React.FormEvent<HTMLFormElement>) => {
            setReviewError("");
            event.stopPropagation();
            trackPromise(
                Axios.post(backendServer(`/attraction/${props.attractionID}/review`), {
                    review: review,
                    stars: rating
                }).then((res) => {
                    if (checkForErrors((res as any).data)) {
                        setValidated(false)
                    } else {
                        setValidated(true)
                        /**
                         * Once it is posted, reload the page to change the information.
                         */
                         window.location.reload();
                    }
                }).catch(function (error) {
                    if (checkForErrors(error.response.data)) {
                        setValidated(false)
                    }
                })
            )
        };

    useEffect(() => {
        if (user) {
            getUserReview()
        }
    }, [])

    if(user) {
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
                        disabled={notAllowed}
                        isInvalid={(reviewError as any)} />
                    <Form.Control.Feedback type="invalid">
                        {reviewError}
                    </Form.Control.Feedback>
                </InputGroup>
                {!notAllowed &&
    
                    <InputGroup>
                    <div className="d-flex flex-column">
                        <Form.Label>Rate this attraction: </Form.Label>
                        <StarRatingForm getRating={function (rating: number) {
                            if (rating === -1) {
                                setRating(null)
                            } else {
                                setRating(rating)
                            }
                        }} />
                        </div>
    
                    </InputGroup>}
                {notAllowed ?
                    <Button className="submitreview"
                        onClick={() => { setnotAllowed(false) }}>Edit my review</Button> :
                    <ButtonWithLoading className="submitreview" disabled={!isFormValid() || promiseInProgress} promiseInProgress={promiseInProgress} message="Post" />}
            </Form>
    
        </div>)

    } else {
        return (<div className="comment"> <LoginFirstCard/></div>)
    }
   
}