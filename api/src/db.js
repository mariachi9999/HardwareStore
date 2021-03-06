require('dotenv').config();
const { Sequelize } = require('sequelize');
const fs = require('fs');
const path = require('path');
const { DB_USER, DB_PASSWORD, DB_HOST, DB_NAME } = process.env;

//esto lo necesita postgres en deploy
let sequelize =
	process.env.NODE_ENV === 'production'
		? new Sequelize({
				database: DB_NAME,
				dialect: 'postgres',
				host: DB_HOST,
				port: 5432,
				username: DB_USER,
				password: DB_PASSWORD,
				pool: {
					max: 3,
					min: 1,
					idle: 10000,
				},
				dialectOptions: {
					ssl: {
						require: true,
						rejectUnauthorized: false,
					},
					keepAlive: true,
				},
				ssl: true,
		  })
		: new Sequelize(
				`postgres://${DB_USER}:${DB_PASSWORD}@${DB_HOST}/${DB_NAME}`,
				{ logging: false, native: false }
		  );

const basename = path.basename(__filename);

const modelDefiners = [];

fs.readdirSync(path.join(__dirname, '/models'))
	.filter(
		(file) =>
			file.indexOf('.') !== 0 && file !== basename && file.slice(-3) === '.js'
	)
	.forEach((file) => {
		modelDefiners.push(require(path.join(__dirname, '/models', file)));
	});

modelDefiners.forEach((model) => model(sequelize));

let entries = Object.entries(sequelize.models);
let capsEntries = entries.map((entry) => [
	entry[0][0].toUpperCase() + entry[0].slice(1),
	entry[1],
]);
sequelize.models = Object.fromEntries(capsEntries);

const {
	Product,
	Role,
	User,
	Category,
	Brand,
	Order,
	OrderDetail,
	Cart,
	Image,
	Review,
} = sequelize.models;

Role.hasMany(User, { foreignKey: 'roleId' });
User.belongsTo(Role, { foreignKey: 'roleId' });

User.hasMany(Order, { foreignKey: 'userId' });
Order.belongsTo(User, { foreignKey: 'userId' });

Order.hasMany(OrderDetail, {
	foreignKey: 'orderId',
});
Product.hasMany(OrderDetail, {
	foreignKey: 'productId',
});
OrderDetail.belongsTo(Product);

User.hasMany(Cart, {
	foreignKey: 'userId',
});
Product.hasMany(Cart, {
	foreignKey: 'productId',
});
Cart.belongsTo(Product);
Cart.belongsTo(User, {
	foreignKey: 'userId',
});

Product.belongsToMany(Category, {
	through: 'category_product',
	foreignKey: 'product_id',
});
Category.belongsToMany(Product, {
	through: 'category_product',
	foreignKey: 'category_id',
});

Brand.hasMany(Product, { foreignKey: 'brandId' });
Product.belongsTo(Brand, { foreignKey: 'brandId' });

Product.belongsToMany(User, { through: 'favorites' });
User.belongsToMany(Product, { through: 'favorites' });

// 1---------------> N
// User -----------> Review
User.hasMany(Review, { foreignKey: 'userId' });
Review.belongsTo(Product, { foreignKey: 'userId' });

// 1---------------> N
// Product -----------> Review
Product.hasMany(Review, { foreignKey: 'productId' });
Review.belongsTo(Product, { foreignKey: 'productId' });

Product.hasMany(Image, { foreignKey: 'productId' });
Image.belongsTo(Product, { foreignKey: 'productId' });



// 1---------------> N
// User -----------> Review
User.hasMany(Review, {foreignKey: 'userId'});
Review.belongsTo(User, {foreignKey: 'userId'});


// 1---------------> N
// Product -----------> Review
Product.hasMany(Review, {foreignKey: 'productId'});
Review.belongsTo(Product, {foreignKey: 'productId'});

module.exports = {
	...sequelize.models,
	conn: sequelize,
};