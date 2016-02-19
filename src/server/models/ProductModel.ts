///<reference path="../../../typings/tsd.d.ts" />
import mongoose = require('mongoose');
var productSchema = require('../schemas/productSchema');
var Product = mongoose.model("Product",productSchema);
export = Product;
