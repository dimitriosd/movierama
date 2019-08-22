import React from 'react';

import {withContext} from "./../AppContext";
import Movie from "./Movie";

const MoviesList = (props) => {

	const sortingChange = (event) => {
		props.getMovies(event, 'desc');
	}

	const isAllowedToReview = (movie) => {
		const moviesWithReviews = props.movies.filter(movie =>
			movie.reviews.length > 0
		)
		const isOwnMovie = moviesWithReviews.find((currentMovie) => movie._id === currentMovie._id)
		return !isOwnMovie;
	}

	const movies = props.movies.map(movie => {
		return (
			<Movie
				key={movie._id}
				movie={movie}
				user={props.user ? props.user._id : null}
				isAllowedToReview={isAllowedToReview}
			/>
		)
	});

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
					     onClick={(event) => sortingChange('likes')}>Likes
					</div>
					<div className={`sort-link ${props.sortBy === 'dislikes' ? 'sort-link-clicked' : ''}`}
					     onClick={(event) => sortingChange('dislikes')}>Hates
					</div>
					<div className={`sort-link ${props.sortBy === 'createdAt' ? 'sort-link-clicked' : ''}`}
					     onClick={(event) => sortingChange('createdAt')}>Date
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
