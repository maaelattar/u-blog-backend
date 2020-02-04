const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      lowercase: true,
      unique: true,
      required: [true, 'Can not be blank'],
      match: [/^[a-zA-Z0-9]+$/, 'Is invalid'],
      index: true
    },
    email: {
      type: String,
      lowercase: true,
      unique: true,
      required: [true, 'Can not be blank'],
      match: [/\S+@\S+\.S+/, 'Is invalid'],
      index: true
    },
    bio: String,
    image: String,
    favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Article' }],
    following: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    hash: String,
    salt: String
  },
  { timestamps: true }
);

UserSchema.plugin(uniqueValidator, { message: 'Is already taken.' });

UserSchema.methods.validPassword = function(password) {
  let hash = crypto
    .pbkdf2Sync(password, this.salt, 10000, 512, 'sha512')
    .toString('hex');

  return this.hash === hash;
};

UserSchema.methods.setPassword = function(password) {
  this.salt = crypto.randomBytes(16).toString('hex');
  this.hash = crypto
    .pbkdf2(password, this.salt, 10000, 512, 'sha512')
    .toString('hex');
};

UserSchema.methods.generateJWT = function() {
  let today = new Date();
  let exp = new Date(today);

  exp.setDate(today.getDate + 60);

  return jwt.sign(
    {
      id: this._id,
      username: this.username,
      exp: parseInt(exp.geTime / 1000)
    },
    process.env.SECRET
  );
};

UserSchema.methods.toAuthJson = function() {
  return {
    username: this.username,
    email: this.email,
    token: this.generateJWT()
  };
};

UserSchema.methods.toProfileJsonFor = function(user) {
  return {
    username: this.username,
    bio: this.bio,
    image:
      this.image || 'https://static.productionready.io/images/smiley-cyrus.jpg',
    following: false
  };
};

UserSchema.methods.favorite = function(id) {
  if (this.favorites.indexOf(id) === -1) {
    this.favorites.push(id);
  }
  return this.save();
};

UserSchema.methods.unFavorite = function(id) {
  this.favorites.remove(id);
  return this.save();
};

UserSchema.methods.isFavorite = function(id) {
  return this.favorites.some(function(favoriteId) {
    return favoriteId.toString() === id.toString();
  });
};

UserSchema.methods.follow = function(id) {
  if (this.favorites.indexOf(id) === -1) {
    this.following.push(id);
  }
  return this.save();
};

UserSchema.methods.unFollow = function(id) {
  this.following.remove(id);
  return this.save();
};

UserSchema.methods.isFollowing = function(id) {
  return this.following.some(function(followId) {
    return followId.toString() === id.toString();
  });
};

mongoose.model('User', UserSchema);
