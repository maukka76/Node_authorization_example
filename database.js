var mongoose = require('mongoose');
var mongodb_connection_string = 'mongodb://127.0.0.1:27017/acl';

exports.connect = function(callback){
	var dbconn = mongoose.connect(mongodb_connection_string,function(err,ok){

		if(err){

			console.log(err.message);
		}else{
			callback(dbconn);
		}
	})
}
