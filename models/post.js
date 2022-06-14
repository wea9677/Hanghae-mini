const mongoose = require('mongoose');
const moment = require('moment')
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

        nDate : {
            type:String,
            required:true
        }
             
           

      
         


        
},
    // {timestamps:true}
);


PostSchema.virtual("contentId").get(function () {
    return this._id.toHexString();
  });
  PostSchema.set("toJSON", {
    virtuals: true,
  });




module.exports = mongoose.model('Post', PostSchema);
