import React from "react";

const ItemCard = ({ text, className, onClick, imageSrc, altText }) => {
    return (
        <>
            <div className={className} onClick={onClick}>
                <img src={imageSrc} alt={altText} />
                <div>{text}</div>
            </div>
        </>
    );
};

export default ItemCard;