import React, { Component } from 'react';
import { withContext } from "./../AppContext";

class NewMovie extends Component {
	constructor() {
		super();
		this.state = {
			title: "",
			description: "",
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
		this.props.addMovie(this.state)
			.then(() => this.props.history.push("/movies"))
			.catch(err => {
				this.setState({errorMessage: err.response.data.message})
			})
	}

	render() {
		return (
			<div className="form-wrapper">
				<form onSubmit={this.handleSubmit}>
					<h3>Please add movie details</h3>
					<input
						onChange={this.handleChange}
						value={this.state.title}
						name="title"
						type="text"
						placeholder="Title..."
						required="required"/>
					<textarea
						onChange={this.handleChange}
						value={this.state.description}
						name="description"
						type="description"
						placeholder="Description..."
						required="required"
					/>
					<button className="submit-button" type="submit">Add</button>
				</form>

				{
					this.state.errorMessage &&
					<p style={{color: "red"}}>{this.state.errorMessage}</p>
				}

			</div>
		)
	}
}

export default withContext(NewMovie);