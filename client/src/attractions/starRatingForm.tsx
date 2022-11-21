import { useState } from "react";
import { Button } from "react-bootstrap";
import "./styling/starRating.css"

interface ratingProps {
    getRating: (rating: number) => void
}

export default function StarRatingForm(props: ratingProps) {
    const [rating, setRating] = useState(-1);
    const [hover, setHover] = useState(0);
    return (
        <div className="star-rating">
            {[...Array(5)].map((star, index) => {
                index += 1;
                return (
                    <Button
                        type="button"
                        id="starButton"
                        key={index}
                        className={index <= ((rating && hover) || hover) ? "on" : "off"}
                        onClick={() => {
                            setRating(index)
                            props.getRating(index)
                        }}
                        onMouseEnter={() => setHover(index)}
                        onMouseLeave={() => setHover(rating)}
                    >
                        <span className="star">&#9733;</span>
                    </Button>
                );
            })}
        </div>
    );
};