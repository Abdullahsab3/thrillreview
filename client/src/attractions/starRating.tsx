import { useState } from "react";
import { Button } from "react-bootstrap";
import "./styling/starRating.css"

interface ratingProps {
    rating: number
}

export default function StarRating(props: ratingProps) {
    return (
        <div className="star-rating">
            {[...Array(5)].map((star, index) => {
                index += 1;
                return (
                    <span
                        id="starButton"
                        key={index}
                        className={index <= props.rating ? "on" : "off"}>&#9733;</span>

                );
            })}
        </div>
    );
};