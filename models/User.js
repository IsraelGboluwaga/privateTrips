const mongoose =  require('mongoose');
const Schema = mongoose.Schema;

//creating a schema
const UserSchema = new Schema({
    Firstname:{
        type: String,
        required : true
    },
    Lastname:{
        type: String,
        required : true
    },
    email:{
        type: String,
        required: true
    },
    password:{
        type: String,
        required : true
    },
    date:{
        type: Date,
        default: Date.now
    }
});

mongoose.model('users', UserSchema);