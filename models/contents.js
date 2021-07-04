const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema.Types


const contentSchema = new mongoose.Schema({
    show_id: {
        type: String
    },

    title: {
        type: String
    },
    director: {
        type: String
    },
    country: {
        type: String
    },
    release_year: {
        type: String
    },
    duration: {
        type: String
    }

})

mongoose.model('contents', contentSchema);