const mongoose = require('mongoose');

const TopicoSchema = new mongoose.Schema({
    plant:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'plant',
        require:true

    },
    description: {
        type: String,
        require: true
    }

});



const Topico = mongoose.model('topic',TopicoSchema);

module.exports = Topico;