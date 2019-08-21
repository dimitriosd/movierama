import React, { Component } from 'react';
import { withContext } from "./../../AppContext"

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

	clearInputs = () => {
		this.setState({
			name: "",
			password: "",
			errorMessage: ""
		})
	}

	handleSubmit = (e) => {
		e.preventDefault();
		this.props.login(this.state)
			.then(() => this.props.history.push("/stories"))
			.catch(err => {
				this.setState({errorMessage: err.response.data.message})
			})
	}

	render() {
		return (
			<div className="form-wrapper">
				<form onSubmit={this.handleSubmit}>
					<h3>Log In</h3>
					<input
						onChange={this.handleChange}
						value={this.state.username}
						name="name"
						type="text"
						placeholder="name"/>
					<input
						onChange={this.handleChange}
						value={this.state.password}
						name="password"
						type="password"
						placeholder="password"/>
					<button type="submit">Submit</button>
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