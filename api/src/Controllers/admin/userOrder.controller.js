const { Op } = require('sequelize');
const { User, Order } = require('../../db');

// https://ecommerceherni.herokuapp.com/admin/usersandhisorders?page=0 (post);

const userOrder = async (req, res, next) => {
	let userAndOrders = {};
	const { limit, search, filter } = req.body;
	const pageAsNumber = Number.parseInt(req.query.page);
	const limitToNumber = Number.parseInt(limit);

	let page = 0;
	if (!Number.isNaN(pageAsNumber) && pageAsNumber >= 0) page = pageAsNumber;

	if (filter && search && search.trim() && filter !== 'all') {
		userAndOrders = await Order.findAndCountAll({
			limit: limitToNumber,
			offset: page * limitToNumber,
			include: { model: User },
			where: {
				status: filter,
			},
		});
		return res.json({
			message: 'here',
			totalPages: Math.floor(userAndOrders.count / limitToNumber),
			products: userAndOrders.rows.filter(({ name }) => name.includes(search)),
		});
	}

	if (filter && filter !== 'all') {
		userAndOrders = await Order.findAndCountAll({
			limit: limitToNumber,
			offset: page * limitToNumber,
			include: { model: User },
			where: {
				status: filter,
			},
		});
		return res.json({
			message: 'here',
			totalPages: Math.floor(userAndOrders.count / limitToNumber),
			products: userAndOrders.rows,
		});
	}

	if (search && search.trim()) {
		userAndOrders = await Order.findAndCountAll({
			limit: limitToNumber,
			offset: page * limitToNumber,
			include: {
				model: User,
				where: {
					name: {
						[Op.iLike]: `%${search.toLowerCase()}%`,
					},
				},
			},
		});
		return res.json({
			message: 'here',
			totalPages: Math.floor(userAndOrders.count / limitToNumber),
			products: userAndOrders.rows,
		});
	}

	userAndOrders = await Order.findAndCountAll({
		limit: limitToNumber,
		offset: page * limitToNumber,
		include: {
			model: User,
		},
	});

	return res.json({
		message: 'here',
		totalPages: Math.floor(userAndOrders.count / limitToNumber),
		products: userAndOrders.rows,
	});
};

module.exports = userOrder;