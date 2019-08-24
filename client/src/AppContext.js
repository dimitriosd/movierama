import React, {Component} from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';

const api = axios.create();

api.interceptors.request.use((config) => {
	const token = Cookies.get('token');
	if (token) {
		config.headers.Authorization = `Bearer ${token}`;
	}
	return config;
});

const AppContext = React.createContext();

export class AppContextProvider extends Component {

	constructor() {
		super();
		this.state = {
			movies: [],
			sortBy: 'createdAt',
			order: 'desc',
			user: Cookies.getJSON('user') || null,
			token: Cookies.get('token') || "",
			owner: {
				_id: null,
				name: null
			}
		}
	}

	componentDidMount() {
		this.getMovies();
	}

	getMovies = (sortBy, order, owner) => {
		const sortByParam = sortBy || this.state.sortBy;
		const orderParam = order || this.state.order;
		const ownerParam = owner || this.state.owner;

		const _userId = this.state.user ? this.state.user._id : '';
		return api.get(`/api/movies/${_userId}`, {
			params: {
				sortBy: `${sortBy || this.state.sortBy}:${order || this.state.order}`,
				owner: ownerParam._id,
				page: 1
			}
		})
			.then(response => {
				this.setState({
					movies: response.data.content,
					sortBy: sortByParam,
					order: orderParam,
					owner: {
						_id: ownerParam._id,
						name: ownerParam.name
					}
				})
				return response;
			})
	};

	addMovie = (movieInfo) => {
		return api.post("/api/movies", movieInfo)
			.then(response => {
				this.getMovies();
				return response;
			})
	};

	signup = (userInfo) => {
		return api.post("/api/users", userInfo)
			.then(response => {
				const { user, token } = response.data;
				Cookies.set("token", token, { secure: process.env.NODE_ENV === 'production' });
				Cookies.set("user", user, { secure: process.env.NODE_ENV === 'production' });
				this.setState({
					user,
					token,
					movies: []
				});
				this.getMovies();
				return response;
			})
	};

	addReview = (storyId, reviewInfo) => {
		return api.post(`/api/reviews/${storyId}`, reviewInfo)
			.then(response => {
				return response;
			})
	};

	updateReview = (reviewId, reviewInfo) => {
		return api.patch(`/api/reviews/${reviewId}`, reviewInfo)
			.then(response => {
				return response;
			})
	};

	deleteReview = (reviewId) => {
		return api.delete(`/api/reviews/${reviewId}`)
			.then(response => {
				return response;
			})
	};

	login = (credentials) => {
		return api.post("/api/users/login", credentials)
			.then(async response => {
				const { token, user } = response.data;
				Cookies.set("token", token, { secure: process.env.NODE_ENV === 'production' })
				Cookies.set("user", user, { secure: process.env.NODE_ENV === 'production' })
				await this.setState({
					user,
					token,
					movies: []
				});
				this.getMovies();
				return response;
			})
	}

	logout = () => {
		Cookies.remove("user");
		Cookies.remove("token");
		this.setState({
			movies: [],
			user: null,
			token: ""
		}, () => {
			this.getMovies();
		});
	}

	render() {
		return (
			<AppContext.Provider
				value={{
					getMovies: this.getMovies,
					signup: this.signup,
					login: this.login,
					logout: this.logout,
					addMovie: this.addMovie,
					addReview: this.addReview,
					updateReview: this.updateReview,
					deleteReview: this.deleteReview,
					...this.state
				}}
			>

				{this.props.children}

			</AppContext.Provider>
		)
	}
}

export const withContext = Component => {
	return props => {
		return (
			<AppContext.Consumer>
				{
					globalState => {
						return (
							<Component
								{...globalState}
								{...props}
							/>
						)
					}
				}
			</AppContext.Consumer>
		)
	}
};
