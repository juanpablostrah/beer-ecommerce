import React from "react";
import "./sku-name.scss";

const SkuName = ({ name, action, isSkuSelected }) => {
	return (
		<button
			onClick={action}
			className={`button-sku ${isSkuSelected ? "selected" : ""}`}
		>
			<span className="sku-name">{name}</span>
		</button>
	);
};

export default SkuName;
