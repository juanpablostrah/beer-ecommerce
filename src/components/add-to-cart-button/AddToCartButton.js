import React from "react";
import "./add-to-card-button.scss";

const AddToCartButton = ({ brand }) => {
	return (
		<button
			className="add-to-cart"
			onClick={() => window.alert(`You add ${brand} to cart!`)}
		>
			<span className="text">Add to cart</span>
		</button>
	);
};

export default AddToCartButton;
