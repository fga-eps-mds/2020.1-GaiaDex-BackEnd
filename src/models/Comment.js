const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema({
    username: {
        type: String,
        require : true
    },
    message: {
        type: String,
        require: true
    },
    vote_count:{
        type: Number,
        require:true
    }

});


const Comment = mongoose.model('comment',CommentSchema);

module.exports = Comment;
//Exemplo de teste insominia
//{
//	"scientificName":"scientificName",
//	"family_name":"family_name",
//	"gender_name":"gender_name",
//	"specie_name":"specie_name",
//	"usage":"usage",
//	"first_User":"first_User",
//	"collection_count":"17",
//	"extinction":"1",
//	"profile_picture":"7",
//	"gbifID":"17",
//	"stateProvince":"brasilia"
//}	