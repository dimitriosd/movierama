import React, { Component } from 'react';
import { withContext } from "./../../AppContext";

class LoginForm extends Component {
	constructor() {
		super();
		this.state = {
			name: "",
			password: "",
			errorMessage: ""
		}
	}

	handleChange = (e) => {
		const { name, value } = e.target
		this.setState({
			[name]: value
		})
	}

	handleSubmit = (e) => {
		e.preventDefault();
		this.props.login(this.state)
			.then(() => this.props.history.push("/movies"))
			.catch(() => {
				this.setState({errorMessage: 'Incorrect credentials!'})
			})
	}

	render() {
		if (this.props.user) {
			this.props.history.push("/movies");
		}

		return (
			<div className="form-wrapper">
				<form onSubmit={this.handleSubmit}>
					<h3>Please enter your credentials</h3>
					<input
						onChange={this.handleChange}
						value={this.state.username}
						name="name"
						type="text"
						placeholder="Name..."
						required="required"/>
					<input
						onChange={this.handleChange}
						value={this.state.password}
						name="password"
						type="password"
						placeholder="Password..."
						required="required"/>
					<button className="submit-button" type="submit">Login</button>
				</form>

				{
					this.state.errorMessage &&
					<p style={{color: "red"}}>{this.state.errorMessage}</p>
				}

			</div>
		)
	}
}

export default withContext(LoginForm);