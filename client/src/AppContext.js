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
			token: Cookies.get('token') || ""
		}
	}

	componentDidMount() {
		this.getMovies();
	}

	getMovies = (sortBy, order) => {
		const _userId = this.state.user ? this.state.user._id : '';
		return api.get(`/api/movies/${_userId}`, {
			params: {
				sortBy: `${sortBy || this.state.sortBy}:${order || this.state.order}`
			}
		})
			.then(response => {
				this.setState({
					movies: response.data,
					sortBy: sortBy ? sortBy : 'createdAt',
					order: order ? order : 'desc'
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
				Cookies.set("token", token);
				Cookies.set("user", user);
				this.setState({
					user,
					token
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

	login = (credentials) => {
		return api.post("/api/users/login", credentials)
			.then(response => {
				const { token, user } = response.data;
				Cookies.set("token", token)
				Cookies.set("user", user)
				this.setState({
					user,
					token
				}, () => {
					this.getMovies();
					return response;
				});
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
