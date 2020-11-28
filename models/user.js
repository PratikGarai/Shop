const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema({
    name : {
        type : String, 
        required : true
    },

    email : {
        type : String,
        required : true
    },

    cart : {
        items : [{
            productId : {
                type : Schema.Types.ObjectId,
                required : true
            },
            quantity : {
                type : Number,
                required : true
            }
        }]
    }
})