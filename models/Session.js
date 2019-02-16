const mongoose =  require('mongoose');
const Schema = mongoose.Schema;

//creating a schema
const SessionSchema = new Schema({
    title:{
        type: String,
        required : true
    },
    details:{
        type: String,
        required: true
    },
    date:{
        type: Date,
        default: Date.now
    }
});

mongoose.model('sessions', SessionSchema);