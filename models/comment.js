const mongoose = require('mongoose');

const CommentSchema = mongoose.Schema(
    {
        nickName : {
            type:String,
            required : true,
            trim: true
        },
    
        comment: {
            type: String,
        },
    
        contentId : {
            type : String,
            required:true,
            trim : true

        }

},

    { timestamps: true }
);

CommentSchema.virtual('commentId').get(function () {
    return this._id.toHexString();
});
CommentSchema.set('toJSON', {
    virtuals: true,
});

module.exports = mongoose.model('Comment', CommentSchema);