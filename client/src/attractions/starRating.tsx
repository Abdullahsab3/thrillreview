import { useState } from "react";
import { Button } from "react-bootstrap";
import "./styling/starRating.css"

interface ratingProps {
    rating: number
    className?: string
}

export default function StarRating(props: ratingProps) {
    return (
        <div className={props.className}>
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