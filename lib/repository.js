var mongodb = require("mongodb");

var MongoRepository = function(connectionString, objectName){

    var WRITE_CONCERN_ACKNOWLEDGED = 1,
        emptyCallback = function () {};

    function usingConnection(callback) {
        mongodb.Db.connect(connectionString, function (err, db) {
            callback(db);
        });
    }
    this.add = function(value, callback) {
        callback = callback || emptyCallback;
        usingConnection(function (db) {
            db.collection(objectName).save(value, {w: WRITE_CONCERN_ACKNOWLEDGED}, callback);
        });
    };

    this.get = function(id, callback){
        usingConnection(function (db) {
            db.collection(objectName)
                .findOne({ _id : id }, function(error, document){
                    callback(document);
                });
        });
    };

    this.find = function(query, callback) {
        usingConnection(function (db) {
            db.collection(objectName).find(query, function(error, documents) {
                documents.toArray(function (err, docArray) {
                    callback(docArray);
                });
            });
        });
    };

    this.update = function(query, value, callback) {
        callback = callback || emptyCallback;
        usingConnection(function (db) {
            db.collection(objectName)
                .update(query, {$set: value}, {multi: true, w: WRITE_CONCERN_ACKNOWLEDGED}, callback);
        });
    };

    this.remove = function(query, callback) {
        usingConnection(function (db) {
            db.collection(objectName).remove(query, {w: WRITE_CONCERN_ACKNOWLEDGED}, callback);
        });
    };
};

exports.Repository = MongoRepository;