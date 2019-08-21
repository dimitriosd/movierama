import React from 'react';
import {Link} from "react-router-dom";
import {withContext} from "./../AppContext"

const Navbar = (props) => {
	let logoutButton;
	let loginButton;
	let signupButton;

	if (props.user) {
		logoutButton = (
			<div className="nav-link">
				<button onClick={() => props.logout()}>Logout</button>
			</div>
		);
	} else {
		loginButton = (
			<div className="nav-link">
				<Link to="/login">Log In</Link>
			</div>
		);
		signupButton = (
			<div className="nav-link">
				<Link to="/signup">Sign Up</Link>
			</div>
		)
	}

	return (
		<nav className="navbar-wrapper">
			{loginButton}
			{signupButton}

			<div className="nav-link">
				<Link to="/movies">Todos</Link>
			</div>
			{logoutButton}
		</nav>
	)
}




export default withContext(Navbar);