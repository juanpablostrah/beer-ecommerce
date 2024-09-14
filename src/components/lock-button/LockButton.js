import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLock } from "@fortawesome/free-solid-svg-icons";
import "./lock-button.scss";

const LockButton = ({ onClick }) => {
	return (
		<button className="lock-button" onClick={onClick}>
			<FontAwesomeIcon icon={faLock} className="lock-icon" />
		</button>
	);
};

export default LockButton;
