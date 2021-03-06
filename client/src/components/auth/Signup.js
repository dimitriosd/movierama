import React, { Component } from 'react';
import { withContext } from "./../../AppContext";

class Signup extends Component {
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
		this.props.signup(this.state)
			.then(() => this.props.history.push("/movies"))
			.catch(err => {
				this.setState({errorMessage: err.response.data.message})
			})
	}

	render() {
		if (this.props.user) {
			this.props.history.push("/movies");
		}

		return (
			<div className="form-wrapper">
				<form onSubmit={this.handleSubmit}>
					<h3>Please create account</h3>
					<input
						onChange={this.handleChange}
						value={this.state.name}
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
						required="required"
						minLength={7}/>
					<button className="submit-button" type="submit">Sign Up</button>
				</form>

				{
					this.state.errorMessage &&
					<p style={{color: "red"}}>{this.state.errorMessage}</p>
				}

			</div>
		)
	}
}

export default withContext(Signup);



