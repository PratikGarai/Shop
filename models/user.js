const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema({
    email : {
        type : String,
        required : true
    },
    password : {
        type : String, 
        required : true
    },
    cart : {
        items : [{
            productId : {
                type : Schema.Types.ObjectId,
                required : true,
                ref : 'Product'
            },
            quantity : {
                type : Number,
                required : true
            }
        }]
    }, 
    resetToken : String, 
    resetTokenExpiration : Date
})

userSchema.methods.addToCart = function(product){
    const cartProductIndex = this.cart.items.findIndex(cp => {
        return cp.productId.toString() === product._id.toString();
    });

    let newQuantity = 1;
    const updateCartItems = [ ...this.cart.items ];

    if(cartProductIndex>=0)
    {
        newQuantity = this.cart.items[cartProductIndex].quantity + 1;
        updateCartItems[cartProductIndex].quantity = newQuantity;
    }
    else
    {
        updateCartItems.push({
            productId : product._id,
            quantity : 1
        });
    }
    const updatedCart = {
        items : updateCartItems
    };
    this.cart = updatedCart;
    return this.save();
}

userSchema.methods.deleteItemFromCart = function(p){
    const updateCartItems = this.cart.items.filter(item=> {
        return item._id.toString() !== p.toString();
    });

    this.cart.items = updateCartItems;
    return this.save();
}

userSchema.methods.clearCart = function(){
    this.cart = { 
        items : [] 
    };
    return this.save(); 
}

module.exports = mongoose.model("User", userSchema);