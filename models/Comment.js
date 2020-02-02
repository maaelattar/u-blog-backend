const mongoose = require('mongoose');
const CommentSchema = new mongoose.Schema(
  {
    body: String,
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    article: { type: mongoose.Schema.Types.ObjectId, ref: 'Article' }
  },
  { timestamps: true }
);

CommentSchema.methods.toJSONFor = user => {
  return {
    id: this._id,
    body: this.body,
    createdAt: this.createdAt,
    author: this.author.toProfileJsonFor(user)
  };
};

mongoose.model('Comment', CommentSchema);