var express = require('express');
var bodyParser = require('body-parser');
var app = express();

const AbsolutePath = __dirname + '/views/index.html';

app.use(function ( req, res, next){
  console.log(req.method + " " + req.path + " - " + req.ip);
  next();
});

app.use(bodyParser.urlencoded({extended: false}));

app.use('/public', express.static(__dirname + '/public'));

app.get('/now', function(req, res, next){
  req.time = new Date().toString();
  next();
}, function(req,res){
  res.send({
    "time" : req.time
  });
});

app.get('/', function(req, res) {
  res.sendFile(AbsolutePath);

});

app.get('/json', function(req, res){
  if(process.env['MESSAGE_STYLE'] == "uppercase"){
    response =  "Hello json".toUpperCase();
  }else{
    response = "Hello json";
  }

  res.json({
    "message" : response
  });

});

app.get('/:word/echo', function( req, res){
  res.send({
    "echo" : req.params.word
  });
});

app.get('/name', function(req,res){
  var { first: firstName, last: lastName} = req.query;
  res.json({
    "name" : `${firstName} ${lastName}`
  });
});

app.post('/name', (req, res) => {
  var { first: firstName, last: lastName } = req.body;
  res.json({
    "name" : `${firstName} ${lastName}`
  });
});

console.log("Hello World");

 module.exports = app;

require('dotenv').config();
mongodb = require('mongodb');
mongoose = require('mongoose');

mongoose.connect(process.env['MONGO_URI'], { useNewUrlParser: true, useUnifiedTopology: true });

const personSchema = new mongoose.Schema({
  name: {type: String, required: true},
  age:   Number,
  favoriteFoods: [String],
});
  
const Person = mongoose.model("Person", personSchema);

const createAndSavePerson = (done) => {
  let terra = new Person({name: "Terra Monsta", age:69, favoriteFoods:["Apple", "Banana", "Carrot"]});

  terra.save(function(error, data) {
    if (error) return done(error);
    done(null, data);
  });
};

let arrayOfPeople = [
  { name: "x", age: 0, favoriteFoods: ["x"]},
  { name: "y", age: 1, favoriteFoods: ["y"]},
  { name: "z", age: 2, favoriteFoods: ["z"]},
];

const createManyPeople = (arrayOfPeople, done) => {
  Person.create( arrayOfPeople, function(error, data) {
    if(error) return done(error);
    done(null , data);
  });
};

const findPeopleByName = (personName, done) => {
  Person.find( {name: personName}, function(error, data) {
    if(error) return done(error);
    done(null , data);
  });
};

const findOneByFood = (food, done) => {
  Person.findOne({favoriteFoods: [food]}, function(error, data) {
    if(error) return done(error);
    done(null , data);
  });
};

const findPersonById = (personId, done) => {
  Person.findById({_id: personId}, function(error, data) {
    if(error) return done(error);
    done(null , data);
  });
};

const findEditThenSave = (personId, done) => {
  const foodToAdd = "hamburger";

  Person.findById({_id: personId}, function(err, person){
  if(err) return done(err);
  person.favoriteFoods.push(foodToAdd);

  person.save(function(error, data) {
    if(error) return done(error);
    done(null , data);
  });

  });

};

const findAndUpdate = (personName, done) => {
  const ageToSet = 20;

  Person.findOneAndUpdate({name: personName}, {age: ageToSet}, {name: true}, function(error, data) {
    if(error) return done(error);
    done(null , data);
  });
};

const removeById = (personId, done) => {
  Person.findOneAndRemove({_id: personId}, function(error, data) {
    if(error) return done(error);
    done(null , data);
  });
};

const removeManyPeople = (done) => {
  const nameToRemove = "Mary";

   Person.remove({name: nameToRemove}, function(error, data) {
    if(error) return done(error);
    done(null , data);
  });
};

const queryChain = (done) => {
  const foodToSearch = "burrito";
  
 Person.find( {favoriteFoods: foodToSearch})
 .sort({name: 1})
 .limit(2)
 .select({age: 0})
 .exec(function(error, data) {
    if(error) return done(error);
    done(null , data);
  });
};

/** **Well Done !!**
/* You completed these challenges, let's go celebrate !
 */

//----- **DO NOT EDIT BELOW THIS LINE** ----------------------------------

exports.PersonModel = Person;
exports.createAndSavePerson = createAndSavePerson;
exports.findPeopleByName = findPeopleByName;
exports.findOneByFood = findOneByFood;
exports.findPersonById = findPersonById;
exports.findEditThenSave = findEditThenSave;
exports.findAndUpdate = findAndUpdate;
exports.createManyPeople = createManyPeople;
exports.removeById = removeById;
exports.removeManyPeople = removeManyPeople;
exports.queryChain = queryChain;
