import {
	SUCCESS_LOGIN,
	ERROR,
	HIDE_ALERT,
	AUTH_USER,
	LOG_OUT,
	GET_PRODUCTS,
	FORGOT_PASSWORD,
	RESET_PASSWORD,
	PRODUCT_DETAIL,
	SUGGESTIONS,
	FETCH_PENDING,
	FETCH_ERROR,
	GET_CATEGORIES,
	GET_HIGHLIGHTS,
	GET_BRANDS,
	FILTER_CATEGORIES,
	CLEAN_SUGGESTIONS,
	FILTER_PRICE,
	FILTERED_PRODUCTS,
	SELECTED_PAGE,
	CLEAN_FILTERS,
	ADD_TO_CART,
	REMOVE_FROM_CART,
	ADJUST_ITEM_QTY,
	LOAD_CURRENT_ITEM,
	LIST_PRODUCT_ON_TABLE,
	SIZE_PAGINATION,
	ORDER_TABLE,
	TABLE_FILTER_BY_CATEGORY,
	SORT_TABLE_BY,
	GET_USERS,
	GOTO_TABLE_PAGE,
	GET_USER_TO_EDIT,
	SET_CART,
	TABLE_FILTER_BRAND,
	FILTER_STOCK,
	ERRORTOKEN,
	FETCH_COUNT_OF_BRAND,
	FETCH_COUNT_OF_CATEGORIES,
	SET_MANUAL_AUTHENTICATION
} from './actionsName';

import axios from 'axios';

export const changePaginationSize = (payload) => ({
	type: SIZE_PAGINATION,
	payload,
});

export const tableFilterByBrand = (payload) => ({
	type: TABLE_FILTER_BRAND,
	payload,
});

export const changeTablePage = (payload) => ({
	type: GOTO_TABLE_PAGE,
	payload,
});

export const sortTableAction = (payload) => ({
	type: SORT_TABLE_BY,
	payload,
});

export const tableFilterByCategory = (payload) => ({
	type: TABLE_FILTER_BY_CATEGORY,
	payload,
});

export const changeOrderTable = (payload) => ({
	type: ORDER_TABLE,
	payload,
});

export const fetchPending = () => ({
	type: FETCH_PENDING,
});

export const fetchError = (error) => ({
	type: FETCH_ERROR,
	error,
});

export const fetchSuggestions = (payload) => ({
	type: SUGGESTIONS,
	payload,
});

export const fetchListProducts = (payload) => ({
	type: LIST_PRODUCT_ON_TABLE,
	payload,
});

export const fetchCountOfBrand = (payload) => ({
	type: FETCH_COUNT_OF_BRAND,
	payload,
});

export const fetchCountOfCategories = (payload) => ({
	type: FETCH_COUNT_OF_CATEGORIES,
	payload,
});

export const cleanSuggestions = () => ({
	type: CLEAN_SUGGESTIONS,
	payload: undefined,
});

export function getListOfProductTable(page, object) {
	return async (dispatch) => {
		try {
			dispatch(fetchPending());
			const res = await axios.post(
				`https://ecommerceherni.herokuapp.com/admin/tablepagination?page=${page}`,
				object
			);
			dispatch(fetchListProducts(res.data));
		} catch (error) {
			dispatch(fetchError(error));
		}
	};
}

export function getCountOfBrand() {
	return async (dispatch) => {
		try {
			dispatch(fetchPending());
			const res = await axios.get(`https://ecommerceherni.herokuapp.com/admin/countofbrand`);
			dispatch(fetchCountOfBrand(res.data));
		} catch (error) {
			dispatch(fetchError(error));
		}
	};
}

export function getCountOfCategories() {
	return async (dispatch) => {
		try {
			dispatch(fetchPending());
			const res = await axios.get(
				`https://ecommerceherni.herokuapp.com/admin/categoriescount`
			);
			dispatch(fetchCountOfCategories(res.data));
		} catch (error) {
			dispatch(fetchError(error));
		}
	};
}

export function getSuggestions(name) {
	return async (dispatch) => {
		try {
			dispatch(fetchPending());
			const res = await axios.get('https://ecommerceherni.herokuapp.com/products/');
			dispatch(fetchSuggestions({ productSuggestions: res.data, name }));
		} catch (error) {
			dispatch(fetchError(error));
		}
	};
}

export function getProducts() {
	return async (dispatch) => {
		axios.get('https://ecommerceherni.herokuapp.com/products/').then((response) => {
			dispatch({ type: GET_PRODUCTS, payload: response.data });
		});
	};
}

export function getCategories() {
	return async (dispatch) => {
		axios.get('https://ecommerceherni.herokuapp.com/categories/').then((response) => {
			dispatch({ type: GET_CATEGORIES, payload: response.data });
		});
	};
}

export function getBrands() {
	return async (dispatch) => {
		axios.get('https://ecommerceherni.herokuapp.com/brands/').then((response) => {
			dispatch({ type: GET_BRANDS, payload: response.data });
		});
	};
}

export function getProductById(id) {
	return async (dispatch) => {
		axios
			.get('https://ecommerceherni.herokuapp.com/products/allproducts/' + id)
			.then((response) => {
				dispatch({ type: PRODUCT_DETAIL, payload: response.data });
			});
	};
}

export function getHighlightProd() {
	return async (dispatch) => {
		axios.get('https://ecommerceherni.herokuapp.com/products').then((response) => {
			dispatch({ type: GET_HIGHLIGHTS, payload: response.data });
		});
	};
}

export function logIn(dato) {
	return async (dispatch) => {
	try {
		const res = await axios.post('https://ecommerceherni.herokuapp.com/auth', dato);
		console.log(res)
		dispatch({
			type: SUCCESS_LOGIN,
			payload: res.data,
		});
	} catch (error) {

		dispatch({
			type: ERROR,
			payload: error.response.data.msg,
		});
	}
};
}

// Retorne el Usuario autenticado en base al JWT
export function authUser(data) {
	return async (dispatch) => {
		const token = localStorage.getItem('token');

		if (token) {
			const tokenAuth = (token) => {
				if (token) {
					axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
				} else {
					delete axios.defaults.headers.common['Authorization'];
				}
			};
			tokenAuth(token);
		}

		try {
			const res = await axios.get('https://ecommerceherni.herokuapp.com/auth');
			console.log(res.data.msg.message);
			if (res.data.user) {
				dispatch({
					type: AUTH_USER,
					payload: res.data,
				});
			} else {
				dispatch({
					type: ERRORTOKEN,
					payload: res.data.msg.message,
				});
			}
		} catch (error) {
			console.log(error);
		}
	};
}

export function logOut() {
	return async (dispatch) => {
		dispatch({
			type: LOG_OUT,
		});
	};
}

export function forgotPassword(email) {
	return async (dispatch) => {
		try {
			const res = await axios.put(
				'https://ecommerceherni.herokuapp.com/auth/forgot-password',
				{ email }
			);
			let hola = res.data.msg;
			dispatch({
				type: FORGOT_PASSWORD,
				payload: {
					email,
					hola,
				},
			});
		} catch (error) {
			dispatch({
				type: ERROR,
				payload: error.response.data.msg,
			});
		}
		setTimeout(() => {
			dispatch({
				type: HIDE_ALERT,
			});
		}, 3000);
	};
}

export function resetPassword(resetLink, newPass) {
	return async (dispatch) => {
		try {
			await axios.put('https://ecommerceherni.herokuapp.com/auth/reset-password', {
				resetLink,
				newPass,
			});
			dispatch({
				type: RESET_PASSWORD,
				payload: {
					resetLink,
					newPass,
				},
			});
		} catch (error) {
			console.log(error);
		}
	};
}

export function loginGmail(data) {
	return async (dispatch) => {
		try {
			const res = await axios.post('https://ecommerceherni.herokuapp.com/authGmail', data);
			console.log(res)
			dispatch({
				type: SUCCESS_LOGIN,
				payload: res.data,
			});
		} catch (error) {
			console.log(error);
		}
	};
}

export const filterCategory = (name) => {
	return { type: FILTER_CATEGORIES, payload: name };
};

export const filterStock = (name) => {
	return { type: FILTER_STOCK, payload: name };
};

export const filterPrice = (name) => {
	return { type: FILTER_PRICE, payload: name };
};

export function getFilteredProducts(query) {
	const { category, brand, price, page, qty, stock } = query;

	return async (dispatch) => {
		axios
			.get(
				`https://ecommerceherni.herokuapp.com/catalog?category=${category}&brand=${brand}&price=${price}&page=${page}&qty=${qty}&stock=${stock}`
			)
			.then((response) => {
				dispatch({ type: FILTERED_PRODUCTS, payload: response.data });
			});
	};
}

export const cleanFilters = () => {
	return { type: CLEAN_FILTERS };
};

export const selectPage = (page) => {
	return { type: SELECTED_PAGE, payload: page };
};

export const addToCart = (itemId) => {
	return {
		type: ADD_TO_CART,
		payload: itemId,
	};
};

export const removeFromCart = (itemId) => {
	return {
		type: REMOVE_FROM_CART,
		payload: {
			id: itemId,
		},
	};
};
//ajustar cantidas
export const adjustQty = (itemId, value) => {
	return {
		type: ADJUST_ITEM_QTY,
		payload: {
			id: itemId,
			qty: value,
		},
	};
};

//recibo el item entero con toda su data
export const loadCurrentItem = (itemId) => {
	return {
		type: LOAD_CURRENT_ITEM,
		payload: {
			id: itemId,
		},
	};
};

/////////////////////////////////////////////// ADMINISTRADOR//////////

export function modifyProduct(elem) {
	return async () => {
		try {
			await axios.put('https://ecommerceherni.herokuapp.com/admin/putproduct', elem);
		} catch (error) {
			console.log(error);
		}
	};
}

export function modifyCateogry(elem) {
	return async () => {
		try {
			await axios.put('https://ecommerceherni.herokuapp.com/admin/putcategory', elem);
		} catch (error) {
			console.log(error);
		}
	};
}

export function modifyBrand(elem) {
	return async () => {
		try {
			await axios.put('https://ecommerceherni.herokuapp.com/admin/putbrand', elem);
		} catch (error) {
			console.log(error);
		}
	};
}

export function createdBrand(elem) {
	return async () => {
		try {
			await axios.post('https://ecommerceherni.herokuapp.com/admin/createdbrand', elem);
		} catch (error) {
			console.log(error);
		}
	};
}

export function createdCategory(elem) {
	return async () => {
		try {
			await axios.post('https://ecommerceherni.herokuapp.com/admin/addCategory', elem);
		} catch (error) {
			console.log(error);
		}
	};
}

export function createdProduct(elem) {
	return async () => {
		try {
			await axios.post('https://ecommerceherni.herokuapp.com/admin/addproduct', elem);
		} catch (error) {
			console.log(error);
		}
	};
}

export function getUsers() {
	return async (dispatch) => {
		axios.get('https://ecommerceherni.herokuapp.com/admin/users').then((response) => {
			dispatch({ type: GET_USERS, payload: response.data });
		});
	};
}

export function getUserToEdit(email) {
	return async (dispatch) => {
		axios.get(`https://ecommerceherni.herokuapp.com/admin/user/${email}`).then((response) => {
			dispatch({ type: GET_USER_TO_EDIT, payload: response.data });
		});
	};
}
//MERCADO PAGO

export function postCart(data) {
	return async (dispatch) => {
		console.log(data);

		try {
			const res = await axios.post(
				'https://ecommerceherni.herokuapp.com/mercadopago/createorder',
				data
			);

			console.log(res.data);

			dispatch({
				type: SET_CART,
				payload: res.data,
			});
		} catch (error) {
			console.log(error);
		}
	};
}
/////////////////////////////////////////////// ADMINISTRADOR//////////

export function setAuthentication() {
	return async (dispatch) => {
		dispatch({
			type: SET_MANUAL_AUTHENTICATION,
		});
	};
}