import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const Button = ({ icon, children, onClick, className, iconClassName }) => {
	return (
		<button onClick={onClick} className={className}>
			{icon && <FontAwesomeIcon icon={icon} className={iconClassName} />}
			{children}
		</button>
	);
};

export default Button;
