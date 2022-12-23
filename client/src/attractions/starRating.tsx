import "./styling/starRating.css"

interface ratingProps {
    rating: number
    className?: string
}
/**
 * A component to display the stars for the rating
 * Based on https://dev.to/michaelburrows/create-a-custom-react-star-rating-component-5o6
 * 
 * @param props the amount of active stars (the rating). an optional classname
 * @returns an array of 5 stars, the first x rating stars of which are active
 */
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