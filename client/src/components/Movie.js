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

const getOwnerName = (currentUser, movieOwner) => currentUser === movieOwner._id ? 'You' : movieOwner.name

const isOwner = (currentUser, movieOwner) => currentUser === movieOwner._id;

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

const getAuthenticatedReviews = (likes, hates, isOwner) => {
	let reviews;
	if (likes > 0 || hates > 0) {
		let likeText = likes === 1 ? 'like' : 'likes';
		let hateText = hates === 1 ? 'hate' : 'hates';
		reviews = (
			<div className="movie-reviews">
				<span className={isOwner ? '' : 'link'}>{likes} {likeText}</span>&nbsp;&nbsp;| &nbsp;&nbsp;
				<span className={isOwner ? '' : 'link'}>{hates} {hateText}</span>
			</div>
		)
	} else {
		reviews = (
			<div className="movie-reviews">
				<span>Be the first one to vote for this movie:</span> &nbsp;&nbsp;
				<span className={isOwner ? '' : 'link'}>Like</span>&nbsp;&nbsp;| &nbsp;&nbsp;
				<span className={isOwner ? '' : 'link'}>Hate</span>
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
			<q className="movie-description">{props.movie.description}</q>
			{props.user ? getAuthenticatedReviews(props.movie.likes, props.movie.dislikes, isOwner(props.user, props.movie.owner)) : getReviews(props.movie.likes, props.movie.dislikes)}
		</div>
	)
};

export default Movie;