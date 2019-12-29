const mongoose = require('mongoose');
const env = require('dotenv').config()
const url = process.env.DB;
const uniqueValidator = require('mongoose-unique-validator');

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true, poolSize: 4}, (err) => {
    if(err) {
        console.log(err)
    } else {
        console.log('connected')
    }
})

const phoneBkSchema = new mongoose.Schema({
    name: {type: String, required: true, minlength: 3, unique: true},
    number: { type: String, required: true, minlength: 8, unique: true},
})

phoneBkSchema.plugin(uniqueValidator)

const Phonebk = mongoose.model('Phonebk',phoneBkSchema)

module.exports = Phonebk;
