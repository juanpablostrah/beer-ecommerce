import React from "react";
import "./menu-button.scss";

const MenuButton = ({ children, action }) => {
	const handleAction = () => {
		if (action) {
			return action();
		}
	};

	return (
		<button onClick={() => handleAction()} className="button">
			{children}
		</button>
	);
};

export default MenuButton;
