var mongoose = require('mongoose');
var tagSchema = require('../schemas/tagSchema');
var Tag = mongoose.model("Tag",tagSchema);
module.exports = Tag;
