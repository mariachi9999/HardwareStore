const Coinpayments = require('coinpayments');
const { response } = require('express');
const { Sequelize } = require('sequelize');
const { Order, OrderDetail, Product, User } = require('../db');
const axios = require('axios');

const {
	COINPAYMENT_API_PUBLIC,
	COINPAYMENT_API_SECRET,
	COINPAYMENT_MERCHAND_ID,
} = process.env;

const CoinpaymentsCredentials = {
	key: '736e355aacd8db0db04f226da8d268fe22b3b87733de4ebec978c9c78893fe75',
	secret: COINPAYMENT_API_SECRET,
};
const client = new Coinpayments(CoinpaymentsCredentials);

// Get your basic account information.
const getBasicInfo = async (req, res) => {
	console.log('entró a getInfo');
	const info = await client.getBasicInfo();

	res.json(info);
};

// Create transaction
const createTransaction = async (req, res) => {
	const CoinpaymentsCreateTransactionOpts = {
		currency1: 'ARS',
		currency2: 'LTCT',
		amount: 100000,
		buyer_email: 'meursault.1986@gmail.com',
		buyer_name: 'Nicolas Meursault',
		// address?: string,
		// item_name?: string,
		// item_number?: string,
		// invoice?: string,
		// custom?: string,
		// ipn_url?: string,
		// success_url?: string,
		// cancel_url?: string
	};

	const order = await client.createTransaction(
		CoinpaymentsCreateTransactionOpts
	);

	res.json(order);
};

//Get Transaction Info
const getTransactionInfo = async (req, res) => {
	const CoinpaymentsGetTxOpts = {
		txid: 'CPFG3YE1SO2MXUAI1EU4LUYYYP',
		full: 0,
	};
	const status = await client.getTx(CoinpaymentsGetTxOpts);
	console.log(status);
	res.json(status);
};

//Get actual Rates.
const getCoinRates = async (req, res) => {
	const CoinpaymentsRatesOpts = {
		short: 1,
		accepted: 2,
	};
	const rates = await client.rates(CoinpaymentsRatesOpts);
	res.json(rates);
};

//Get POS.
const createPos = async (req, res) => {
	const { amount } = req.body;

	const pos = `https://www.coinpayments.net/index.php?cmd=_pos&reset=1&merchant=${COINPAYMENT_MERCHAND_ID}&item_name=Order+Payment&currency=ARS&allow_currency=1&amountf=${amount}`;
	const rates = await client.rates(CoinpaymentsRatesOpts);
	console.log(rates);
	res.json(rates);
};

//---------------ACA CREAMOS LA ORDEN------------------
const createOrderCrypto = async function createOrderCrypto(req, res) {
	const { ammount, status, prodCarrito, id } = req.body;

	try {
		var newOrder = await Order.create(
			{
				ammount,
				status,
			},
			{
				fields: ['ammount', 'status'],
			}
		).then((order) => {
			prodCarrito &&
				prodCarrito.forEach((prod) => {
					(async function createOrderDetail() {
						var newDetail = await OrderDetail.create(
							{
								price: prod.price,
								quantity: prod.qty,
							},
							{
								fields: ['price', 'quantity'],
							}
						);

						var productFind = await Product.findOne({
							where: { id: prod.prodId },
						});

						if (productFind) {
							await newDetail.setProduct(productFind.dataValues.id);
							let count = productFind.dataValues.stock - prod.qty;

							await productFind.update({
								stock: count,
							});
						}
						await order.addOrderDetail(newDetail.dataValues.id);

						var userFind = await User.findOne({
							where: { userId: id },
						});

						if (userFind) {
							await order.setUser(userFind.dataValues.userId);
						} else {
							res.status(400).json({ msg: 'Error' });
						}
					})();
				});
		});
		const orders = await Order.findAll();
		const order = orders[orders.length - 1];
		order.userId = id;
		res.status(200).json(order);
	} catch (error) {
		res.status(400).json(error);
	}
};

//////////////////// Coinpayment IPN

const ipnUpdate = async (req, res, next) => {
	// item_number=userId
	// custom=orderId
	console.log(req.body);

	const id = parseInt(req.body.custom);
	const newStatus = parseInt(req.body.status);

	try {
		const orderById = await Order.findOne({
			where: { orderId: id },
		});
		res.send(id);
		if (newStatus === 100) {
			var updatedStatus = await orderById.update({
				status: 'completed',
			});

			let transporter = nodemailer.createTransport({
				service: 'gmail',
				auth: {
					type: 'OAuth2',
					user: process.env.MAIL_USERNAME,
					pass: process.env.MAIL_PASSWORD,
					clientId: process.env.OAUTH_CLIENTID,
					clientSecret: process.env.OAUTH_CLIENT_SECRET,
					refreshToken: process.env.OAUTH_REFRESH_TOKEN,
				},
			});

			var mailOptions = {
				from: 'hardwarecommerce@gmail.com',
				to: email,
				subject: 'Order Confirmation',
				html: `
				<!DOCTYPE html>
				<html>
				<head>
				<style>
				table {
				  font-family: arial, sans-serif;
				  border-collapse: collapse;
				  width: 100%;
				}
		
				td, th {
				  border: 1px solid #dddddd;
				  text-align: left;
				  padding: 8px;
				}
		
				tr:nth-child(even) {
				  background-color: #dddddd;
				}
				</style>
				</head>
								<body style="background-color: #424242; font-family: 'Roboto', sans-serif; ">
				<div style="background-color: #C6C6C6; padding: 10px ">
								<h1 style="color: #FF3C4A; text-align: center;">Hardware Store</h1>
										</div>
		
				<div style="background-color: white; padding: 10px; margin: 10px 0; ">
				 <p style="text-align: center; color: white;font-weight: 900; background-color: #FF3C4A; padding: 10px;">Thank you for your purchase!</p>
				<h3 style="text-align: center;" >ORDER CONFIRMATION </h3>
				<p style="text-align: center;" >Your purchase has been approved!</p>
				 <p style="text-align: center;" >Check on coinPayments to get the rest of the info</p>
				
		
						  </div>
		
				<div style="background-color: #424242; color: white; padding: 10px;">
		
				</div>
		
										</div>
								</body>
								</html>
		
			 `,
			};

			transporter.sendMail(mailOptions, function (err, data) {
				if (err) {
					console.log('Error ' + err);
				} else {
					res.send(console.log(api));
				}
			});
		} else if (newStatus < 0) {
			var updatedStatus = await orderById.update({
				status: 'cancelled',
			});

			let transporter = nodemailer.createTransport({
				service: 'gmail',
				auth: {
					type: 'OAuth2',
					user: process.env.MAIL_USERNAME,
					pass: process.env.MAIL_PASSWORD,
					clientId: process.env.OAUTH_CLIENTID,
					clientSecret: process.env.OAUTH_CLIENT_SECRET,
					refreshToken: process.env.OAUTH_REFRESH_TOKEN,
				},
			});

			var mailOptions = {
				from: 'hardwarecommerce@gmail.com',
				to: email,
				subject: 'Order Confirmation',
				html: `
				<!DOCTYPE html>
				<html>
				<head>
				<style>
				table {
				  font-family: arial, sans-serif;
				  border-collapse: collapse;
				  width: 100%;
				}
		
				td, th {
				  border: 1px solid #dddddd;
				  text-align: left;
				  padding: 8px;
				}
		
				tr:nth-child(even) {
				  background-color: #dddddd;
				}
				</style>
				</head>
								<body style="background-color: #424242; font-family: 'Roboto', sans-serif; ">
				<div style="background-color: #C6C6C6; padding: 10px ">
								<h1 style="color: #FF3C4A; text-align: center;">Hardware Store</h1>
										</div>
		
				<div style="background-color: white; padding: 10px; margin: 10px 0; ">
				 <p style="text-align: center; color: white;font-weight: 900; background-color: #FF3C4A; padding: 10px;">We really sorry!</p>
				<h3 style="text-align: center;" >ORDER CONFIRMATION </h3>
				<p style="text-align: center;" >Your purchase has not been approved!</p>
				 <p style="text-align: center;" >Check on coinPayments to get the rest of the info</p>
				
		
						  </div>
		
				<div style="background-color: #424242; color: white; padding: 10px;">
		
				</div>
		
										</div>
								</body>
								</html>
		
			 `,
			};

			transporter.sendMail(mailOptions, function (err, data) {
				if (err) {
					console.log('Error ' + err);
				} else {
					res.send(console.log(api));
				}
			});
		} else if (newStatus >= 0 && newStatus < 100) {
			var updatedStatus = await orderById.update({
				status: 'processing',
			});
		}
		res.status(200).json(updatedStatus.dataValues.status);
	} catch (error) {
		next(error);
	}
};

//Get Transactions List
const getTransactionList = async (req, res) => {
	const CoinpaymentsGetTxListOpts = {
		limit: 100,
		start: 0,
		newer: 0,
		all: 0,
	};

	const transactionList = await client.getTxList(CoinpaymentsGetTxListOpts);
	console.log(transactionList);
	res.json(transactionList);
};

////////////////////

module.exports = {
	getBasicInfo,
	createTransaction,
	getTransactionInfo,
	getCoinRates,
	createOrderCrypto,
	ipnUpdate,
	getTransactionList,
};
