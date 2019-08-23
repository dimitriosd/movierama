import React, {Component} from 'react';
import moment from 'moment'

class Movie extends Component {
	constructor(props) {
		super(props);
		this.state = {
			status: props.movie.reviews && props.movie.reviews.length > 0 ? props.movie.reviews[0].status : 0,
			likes: props.movie.likes,
			hates: props.movie.dislikes,
			userReviewId: props.movie.reviews && props.movie.reviews.length > 0 ? props.movie.reviews[0]._id : null
		};
		this.movie = props.movie;
		this.user = props.user;
	}

	render() {
		return (
			<div className="movie-wrapper">
				<div className="movie-title">{this.movie.title}</div>
				<div className="posted-by">Posted by <span onClick={() => this.props.getMovies(null, null, this.movie.owner)}
					className="link"> {this.getOwnerName()} </span>{this.getDaysDiff()}
				</div>
				<q className="movie-description">{this.movie.description}</q>
				{this.user ? this.getAuthenticatedReviews(this.isOwner()) : this.getReviews()}
			</div>
		)
	}

	getDaysDiff() {
		const date = this.movie.createdAt;
		const now = moment(new Date()).startOf('day');
		const created = moment(date).startOf('day');
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

	getOwnerName() {
		return this.user === this.movie.owner._id ? 'You' : this.movie.owner.name;
	}

	isOwner() {
		return this.user === this.movie.owner._id;
	}

	getReviews() {
		const likes = this.state.likes;
		const hates = this.state.hates;
		let reviews;
		if (likes > 0 || hates > 0) {
			let likeText = likes === 1 ? 'like' : 'likes';
			let hateText = hates === 1 ? 'hate' : 'hates';
			reviews = (
				<div className="movie-reviews">
					<span>{likes} {likeText}</span>&nbsp;&nbsp; | &nbsp;&nbsp;
					<span>{hates} {hateText}</span>
				</div>
			)
		}
		return reviews
	}

	getAuthenticatedReviews(isOwner) {
		return isOwner ? this.getReviewAsOwner() : this.getReviewAsWatcher();
	}

	getReviewAsOwner() {
		const likes = this.state.likes;
		const hates = this.state.hates;
		let likeText = likes === 1 ? 'like' : 'likes';
		let hateText = hates === 1 ? 'hate' : 'hates';
		return (
			<div className="movie-reviews">
				<span>{likes} {likeText}</span>&nbsp;&nbsp; | &nbsp;&nbsp;
				<span>{hates} {hateText}</span>
			</div>
		)
	}

	getReviewAsWatcher() {
		const likes = this.state.likes;
		const hates = this.state.hates;
		let reviews;
		if (likes === 0 && hates === 0) {
			reviews = (
				<div className="movie-reviews">
					<span>Be the first one to vote for this movie:</span> &nbsp;&nbsp;
					<span className="review-link" onClick={() => this.addReview(1)}>Like</span>&nbsp;&nbsp; | &nbsp;&nbsp;
					<span className="review-link" onClick={() => this.addReview(-1)}>Hate</span>
				</div>
			)
		} else {
			reviews = this.state.status === 0 ? this.getNonReviewedContext() : this.getAlreadyReviewedContext();
		}
		return reviews
	}

	getAlreadyReviewedContext() {
		const likes = this.state.likes;
		const hates = this.state.hates;
		const likeText = likes === 1 ? 'like' : 'likes';
		const hateText = hates === 1 ? 'hate' : 'hates';
		const status = this.state.status === 1 ? 'like' : 'hate';
		const likeButton = <span onClick={() => this.updateReview(1)}
		                         className={`review-link ${this.state.status === 1 ? 'review-link-disabled' : ''}`}>{likes} {likeText}</span>;
		const hateButton = <span onClick={() => this.updateReview(-1)}
		                         className={`review-link ${this.state.status === -1 ? 'review-link-disabled' : ''}`}>{hates} {hateText}</span>;

		const reviews = (
			<div className="movie-reviews">
				{likeButton}&nbsp;&nbsp;| &nbsp;&nbsp;
				{hateButton}
				<div className="review-msg">
					<span>You {status} this movie</span>&nbsp;&nbsp; | &nbsp;&nbsp;
					<span onClick={() => this.deleteReview()} className="review-link">Un{status}</span>
				</div>
			</div>

		)
		return reviews

	}

	getNonReviewedContext() {
		const likes = this.state.likes;
		const hates = this.state.hates;
		let reviews;
		let likeText = likes === 1 ? 'like' : 'likes';
		let hateText = hates === 1 ? 'hate' : 'hates';
		reviews = (
			<div className="movie-reviews">
				<span onClick={() => this.addReview(1)} className="review-link">{likes} {likeText}</span>&nbsp;&nbsp;| &nbsp;&nbsp;
				<span onClick={() => this.addReview(-1)} className="review-link">{hates} {hateText}</span>
			</div>
		)
		return reviews
	}

	async addReview(status) {
		let likes = this.state.likes;
		let hates = this.state.hates;

		if (status === 1) {
			likes++;
		} else {
			hates++;
		}
		await this.setState({
			status,
			likes,
			hates
		});
		this.props.addReview(this.movie._id, { status }).then((response) => {
			this.setState({
				userReviewId: response.data._id
			});
		})
	}

	async updateReview(status) {
		let likes = this.state.likes;
		let hates = this.state.hates;

		if (status === 1) {
			likes++;
			hates--;
		} else {
			likes--;
			hates++;
		}

		await this.setState({
			status,
			likes,
			hates
		});

		this.props.updateReview(this.state.userReviewId, { status });
	}

	async deleteReview() {
		let likes = this.state.likes;
		let hates = this.state.hates;

		if (this.state.status === 1) {
			likes--;
		} else {
			hates--;
		}

		await this.setState({
			status: 0,
			likes,
			hates
		});
		this.props.deleteReview(this.state.userReviewId);
	}

};

export default Movie;