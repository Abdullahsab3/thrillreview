import Axios from "axios"
import { useEffect, useState } from "react"
import { Pagination } from "react-bootstrap"
import { backendServer } from "../helpers"
import Review from "./Review"
import WriteReview from "./reviewForm"

interface ReviewsProps {
    attractionID: string
}
export default function Reviews(props: ReviewsProps) {
    const disabledPage = -1
    const initialLimit = 5

    const [Error, setError] = useState("")
    const [reviews, setReviews] = useState([])
    const [page, setPage] = useState(1)
    const [nextPage, setNextPage] = useState(disabledPage)
    const [nextLimit, setNextLimit] = useState(initialLimit)
    const [prevPage, setPrevPage] = useState(disabledPage)
    const [prevLimit, setPrevLimit] = useState(initialLimit)
    const [limit, setLimit] = useState(initialLimit)

    function getReviews() {
        setReviews([])
        Axios.get(backendServer(`/attraction/${props.attractionID}/reviews?limit=${limit}&page=${page}`)).then((res) => {
            setReviews(res.data.reviews)
            if(res.data.next) {
                setNextPage(res.data.next.page)
                setNextLimit(res.data.next.limit)
            } else {
                setNextPage(disabledPage)
            }
            if(res.data.previous) {
                setPrevPage(res.data.previous.page)
                setPrevLimit(res.data.previous.limit)
            } else {
                setPrevPage(disabledPage)
            }
        }).catch(function (error: any) {
            if (error.response.data.reviews) {

                setError(error.response.data.reviews)

            } else if (error.response.data.error) {
                setError(error.response.data.error)
            }
        })
    }

    function handleNext(event: any) {
        event.preventDefault()
        setPage(nextPage);
        setLimit(nextLimit)
    }

    function handlePrev(event: any) {
        event.preventDefault()
        setPage(prevPage)
        setLimit(prevLimit)
    }

    useEffect(() => {
        getReviews()
    }, [page])



    return (
        <div className="d-flex flex-column">
            <h1>Reviews</h1>
            <WriteReview attractionID={props.attractionID} />
            {reviews.map(review => {
                return (<Review attractionID={props.attractionID} userID={(review as any).userID} reviewText={(review as any).review} rating={(review as any).stars} date={(review as any).date} />)
            })}
            <Pagination className="pagination">
                <Pagination.Prev disabled={prevPage == disabledPage} onClick={handlePrev}/>
                <Pagination.Item active>{page}</Pagination.Item>
                <Pagination.Next disabled={nextPage == disabledPage} onClick={handleNext}/>
            </Pagination>
        </div>
    )

}