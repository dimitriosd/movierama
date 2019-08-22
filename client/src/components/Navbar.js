import React from 'react';
import {Link} from "react-router-dom";
import { withContext } from "./../AppContext"

const Navbar = (props) => {
	let loggedInWrapper;
	let loginButton;
	let signupButton;

	if (props.token) {
		loggedInWrapper = (

			<div className="nav-link logged">
				<div className="welcome-msg">
					Welcome back <span className="link">{props.user.name}</span>
				</div>
				<button onClick={() => props.logout()}>Logout</button>
			</div>
		);
	} else {
		loginButton = (
			<div className="nav-link login">
				<Link to="/login">Log In</Link>
				<span>or</span>
			</div>
		);
		signupButton = (
			<div className="nav-link signup">
				<Link to="/signup">Sign Up</Link>
			</div>
		)
	}

	return (
		<nav className="navbar-wrapper">
			<h1 className="title">
				<Link to="/movies">MovieRama</Link>
			</h1>
			<div className="nav-buttons">
				{loginButton}
				{signupButton}
				{loggedInWrapper}
			</div>
		</nav>
	)
}

export default withContext(Navbar);