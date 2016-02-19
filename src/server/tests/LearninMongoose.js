var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/test');

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback () {
  console.log("Logged on to mongo");
});

var kittySchema = mongoose.Schema({
    name: String
});

var Kitten = mongoose.model('Kitten', kittySchema);

var k = new Kitten({ name: 'liav' });

k.save(function (err, kitten) {
  if (err) return console.error(err);
  console.log("Saved "+kitten.name);
});