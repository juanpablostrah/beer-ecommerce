import React from "react";
import "./add-to-card-button.scss";

const AddToCartButton = () => {
	return (
		<button
			className="add-to-cart"
			onClick={() => window.alert("Add to cart clicked!")}
		>
			<span className="text">Add to cart</span>
		</button>
	);
};

export default AddToCartButton;
