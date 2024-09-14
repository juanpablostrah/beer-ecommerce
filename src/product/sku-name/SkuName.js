import React from "react";
import "./sku-name.scss";

const SkuName = ({ name, action }) => {
	return (
		<button onClick={action()} className="button-sku">
			<span className="sku-name">{name}</span>
		</button>
	);
};

export default SkuName;
