import React from 'react';
import {withContext} from "./../AppContext";

const MoviesList = (props) => {
	const movies = props.movies.map(movie => {
		return (
			<div key={movie._id}>{movie.title}</div>
		)
	})
	return <div>{movies}</div>
}

export default withContext(MoviesList);
