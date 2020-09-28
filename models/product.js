class Product
{
	constructor(title, price, description, imageUrl)
	{
		this.title = title;
		this.price = price;
		this.description = description;
		this.imageUrl = imageUrl;
	}

	save()
	{
	}
}

module.exports = Product;

const Product = sequelize.define('product' , {
	id : {
		type : Sequelize.INTEGER,
		autoIncrement : true,
		allowNull : false,
		primaryKey : true
	},
	title : {
		type : Sequelize.STRING,
		allowNull : false
	},
	price : {
		type : Sequelize.DOUBLE,
		allowNull : false,
	},
	imageUrl : {
		type : Sequelize.STRING(500),
		allowNull : false,
	},
	description : {
		type : Sequelize.STRING(500),
		allowNull : false
	}
});

