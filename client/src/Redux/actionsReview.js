import axios from 'axios';
import { ALL_REVIEWS, ALL_STARS, GET_AVERAGE } from './actionsName';

export function getAverage(productId) {
	return async (dispatch) => {
		try {
			const res = await axios.post('https://ecommerceherni.herokuapp.com/reviews/averaged', {productId});

			 dispatch({
			 	type: GET_AVERAGE,
			 	payload: res.data
			 })
		} catch (error) {
			console.log(error);
		}
	};
}


export function postReview(data) {
	return async (dispatch) => {
		try {
			const res = await axios.post('https://ecommerceherni.herokuapp.com/reviews', data);
		} catch (error) {
			console.log(error);
		}
	};
}


export function allReviews(productId) {
	return async (dispatch) => {

		try {
			const res = await axios.post('https://ecommerceherni.herokuapp.com/reviews/byproduct', {productId});
		
			dispatch({
				type: ALL_REVIEWS,
				payload: res.data
			})
		} catch (error) {
			console.log(error);
		}
	};
}





export function StarsAmmount(productId) {
	return async (dispatch) => {

		try {
			const res = await axios.post('https://ecommerceherni.herokuapp.com/reviews/allStars', {productId});
			dispatch({
				type: ALL_STARS,
				payload: res.data
			})
		} catch (error) {
			console.log(error);
		}
	};
}
