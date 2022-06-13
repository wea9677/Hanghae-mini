const mongoose = require('mongoose');
// const Comment = require('../models/comment');

const PostSchema = new mongoose.Schema(
    {
        nickName : {
                type:String,
                required : true,
                trim: true
        },

        title : {
            type : String,
            required : true,
            trim: true,
        },

        imageUrl : {
            type : String,
            required : true

        },

        content : {
            type : String,
            required:true,
            trim : true

        },
         date : {
            type:String,
            
         }


        
},
    
);


PostSchema.virtual("contentId").get(function () {
    return this._id.toHexString();
  });
  PostSchema.set("toJSON", {
    virtuals: true,
  });




module.exports = mongoose.model('Post', PostSchema);
