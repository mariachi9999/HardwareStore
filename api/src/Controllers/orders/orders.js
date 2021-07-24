const { Sequelize } = require('sequelize');
const { Order, OrderDetail, Product } = require('../../db.js');

//-------------------------  GETS ALL ORDERS  --------------------------------//

const getOrders = async function getOrders(req, res, next) {
	try {
		const allOrders = await Order.findAll({ include: 'orderDetails' });
		res.status(200).json(allOrders);
	} catch (error) {
		next(error);
	}
};

//----------------------  GETS ONE ORDER BY ID  ---------------------------//

const getOrderById = async function getOrderById(req, res, next) {
	const id = parseInt(req.params.id);

	try {
		const orderById = await Order.findOne({
			include: 'orderDetails',
			where: {
				orderId: id,
			},
		});
		res.status(200).json(orderById);
	} catch (error) {
		next(error);
	}
};

const modifyOrderStatus = async function modifyOrderStatus(req, res, next) {
	// type: ENUM('created', 'processing', 'cancelled', 'completed'),

// 	Payment Statuses
// Payments will post with a 'status' field, here are the currently defined values:

//     -2 = PayPal Refund or Reversal
//     -1 = Cancelled / Timed Out
//     0 = Waiting for buyer funds
//     1 = We have confirmed coin reception from the buyer
//     2 = Queued for nightly payout (if you have the Payout Mode for this coin set to Nightly)
//     3 = PayPal Pending (eChecks or other types of holds)
//     5 = In Escrow (if you are using SetEscrow)
//     100 = Payment Complete. We have sent your coins to your payment address or 3rd party payment system reports the payment complete

// For future-proofing your IPN handler you can use the following rules:

//     <0 = Failures/Errors
//     0-99 = Payment is Pending in some way
//     >=100 = Payment completed successfully

// IMPORTANT: You should never ship/release your product until the status is >= 100 OR == 2 (Queued for nightly payout)!
	
const id = parseInt(req.params.id);
	const newStatus = req.body.status

	try {
		const orderById = await Order.findOne({
			where: { orderId: id },
		});
		if(newStatus === 'Complete'){
			var updatedStatus = await orderById.update({
				status: 'complete',
			});
		}

		res.status(200).json(updatedStatus.dataValues.status);
	} catch (error) {
		next(error);
	}
};

//------------------  GETS ALL ORDERS BY USER ID - FOR USERS ACCOUNT  ----------------------//

const findUserOrders = async function findUserOrders(req, res, next) {
    const userId = parseInt(req.params.userid);
 
    try {
        const allUserOrders = await Order.findAll({
            where: { userId: userId },
            attributes: ['userId', 'status'],
            include: [ 
            {
                model: OrderDetail,
                as: "orderDetails",
                attributes: ['id', 'orderId'],
                include: [
                    {
                        model: Product,
                        
                        attributes: [ 'id','name', 'price', 'image', 'priceSpecial', 'description', 'weight', 'stock' ]
                    }
                ]
                
            },
        
        ]
        });
        
        res.status(200).json(allUserOrders);
    } catch (error) {
        next(error);
    }
};


module.exports = {
	getOrders,
	getOrderById,
	modifyOrderStatus,
	findUserOrders,
};
