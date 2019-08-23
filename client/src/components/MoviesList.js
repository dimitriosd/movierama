import React from 'react';

import {withContext} from "./../AppContext";
import Movie from "./Movie";

const MoviesList = (props) => {

	let movies;

	if (props.movies.length === 0) {
		movies = <div className="no-movies-msg">There are no movies available</div>
	} else {
		movies = props.movies.map(movie => {
			return (
				<Movie
					key={movie._id}
					movie={movie}
					user={props.user ? props.user._id : null}
					getMovies={props.getMovies}
					addReview={props.addReview}
					updateReview={props.updateReview}
					deleteReview={props.deleteReview}
				/>
			)
		});
	}

	const sortingChange = (event) => {
		props.getMovies(event, 'desc');
	}

	let newMovieButton;

	if (props.token) {
		newMovieButton = <button onClick={() => props.history.push('/add')}>New Movie</button>;
	}

	return (
		<div className="movies-list-wrapper">
			<nav className="options-wrapper">
				<div className="sorting">
					<span>Sort By:</span>
					<div className={`sort-link ${props.sortBy === 'likes' ? 'sort-link-clicked' : ''}`} value="createdAt"
					     onClick={() => sortingChange('likes')}>Likes
					</div>
					<div className={`sort-link ${props.sortBy === 'dislikes' ? 'sort-link-clicked' : ''}`}
					     onClick={() => sortingChange('dislikes')}>Hates
					</div>
					<div className={`sort-link ${props.sortBy === 'createdAt' ? 'sort-link-clicked' : ''}`}
					     onClick={() => sortingChange('createdAt')}>Date
					</div>
				</div>
				{newMovieButton}
			</nav>
			<div className="movies-list">
				{movies}
			</div>
		</div>
	)
}

export default withContext(MoviesList);
