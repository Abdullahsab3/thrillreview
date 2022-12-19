import Axios from "axios"
import { useEffect, useState } from "react"
import { Dropdown, Pagination } from "react-bootstrap"
import { backendServer } from "../helpers"
import Review from "./Review"
import WriteReview from "./reviewForm"
import "./styling/reviews.css"

interface ReviewsProps {
    attractionID: number
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
    const [order, setOrder] = useState("date")
    const [sort, setSort] = useState("desc")

    function getReviews() {
        setReviews([])
        Axios.get(backendServer(`/attraction/${props.attractionID}/reviews?limit=${limit}&page=${page}&orderBy=${order}&sort=${sort}`)).then((res) => {
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
    }, [page, order, sort])



    function OrderMenu() {
        return (
          <Dropdown title="Sort by">
            <Dropdown.Toggle variant="Secondary" size="sm"  className="dropmenu">
              Sort by
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item 
                onClick={(ev) => {
                    setOrder("date")
                    setSort("desc")}}>Date: newest first</Dropdown.Item>
              <Dropdown.Item 
                onClick={(ev) => {
                    setOrder("date")
                    setSort("asc")
                }}>Date: oldest first</Dropdown.Item>
              <Dropdown.Item 
                onClick={(ev) => {
                    setOrder("stars")
                    setSort("desc")
                }}>Stars: highest first</Dropdown.Item>
              <Dropdown.Item 
                onClick={(ev) => {
                    setOrder("stars")
                    setSort("asc")
                }}>Stars: Lowest first</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        );
      }

    return (
        <div className="d-flex flex-column">
            <h1>Reviews</h1>
            <WriteReview attractionID={props.attractionID} />
            
            <OrderMenu/>
            {reviews.map(review => {
                return (
                <Review 
                    key={(review as any).userID} 
                    attractionID={props.attractionID} 
                    userID={(review as any).userID} 
                    reviewText={(review as any).review} 
                    rating={(review as any).stars} 
                    date={(review as any).date} />)
            })}
            <Pagination className="pagination paginationReview" size="lg">
                <Pagination.Prev disabled={prevPage === disabledPage} onClick={handlePrev}>Previous</Pagination.Prev>
                
                <Pagination.Next disabled={nextPage === disabledPage} onClick={handleNext}>Next</Pagination.Next>
            </Pagination>
        </div>
    )

}