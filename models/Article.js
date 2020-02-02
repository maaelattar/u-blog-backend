const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const slug = require('slug');

const ArticleSchema = new mongoose.Schema(
  {
    slug: { type: String, lowercase: true, unique: true },
    title: String,
    description: String,
    body: String,
    favoritesCount: { type: Number, default: 0 },
    tagList: [{ type: String }],
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
  },
  { timestamps: true }
);

ArticleSchema.plugin(uniqueValidator, { message: 'Is already taken' });

ArticleSchema.pre('validate', next => {
  this.slugify();
  next();
});

ArticleSchema.methods.slugify = () => {
  this.slug = slug(this.title);
};

ArticleSchema.methods.toJSONFor = user => {
  return {
    slug: this.slug,
    title: this.title,
    description: this.description,
    body: this.body,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt,
    tagList: this.tagList,
    favoritesCount: this.favoritesCount,
    author: this.author.toProfileJSONFor(user)
  };
};

mongoose.model('Article', ArticleSchema);
