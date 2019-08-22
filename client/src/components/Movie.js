import React from 'react';
import moment from 'moment'


const getDaysDiff = (date) => {
	const now = moment(new Date());
	const created = moment(date)
	const diff = now.diff(created, 'days');
	switch (diff) {
		case 0:
			return 'Today'
		case 1:
			return 'Yesterday'
		default:
			return `${diff} days ago`
	}
};

const getOwnerName = (currentUser, movieOwner) => {
	return currentUser === movieOwner._id ? 'You' : movieOwner.name
}

const getReviews = (likes, hates) => {
	let reviews;
	if (likes > 0 || hates > 0) {
		let likeText = likes === 1 ? 'like' : 'likes';
		let hateText = hates === 1 ? 'hate' : 'hates';
		reviews = (
			<div className="movie-reviews">
				<span>{likes} {likeText}</span>&nbsp;&nbsp;| &nbsp;&nbsp;
				<span>{hates} {hateText}</span>
			</div>
		)
	}
	return reviews
}

const Movie = (props) => {
	return (
		<div className="movie-wrapper">
			<div className="movie-title">{props.movie.title}</div>
			<div className="posted-by">Posted by <span
				className="link"> {getOwnerName(props.user, props.movie.owner)} </span>{getDaysDiff(props.movie.createdAt)}</div>
			<div className="movie-description">{props.movie.description}</div>
			{getReviews(props.movie.likes, props.movie.dislikes)}
		</div>
	)
};

export default Movie;