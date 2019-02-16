const mongoose =  require('mongoose');
const Schema = mongoose.Schema;

//creating a schema
const ContactSchema = new Schema({
    name:{
        type: String,
        required : true
    },
    email:{
        type: String,
        required: true
    },
    message:{
        type: String,
        required: true
    },
    news:{
        type: String,
        required:false

    },
    date:{
        type: Date,
        default: Date.now
    }
});

mongoose.model('contact', ContactSchema);