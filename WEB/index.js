'use strict'
var express = require('express'),
	bodyParser = require('body-parser');

var app = express();
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

var mysql = require('mysql');
var configs = require('./config.js'),
	option = configs.dbOption;

var createConnection = function(){
	return (mysql.createConnection({
		host: option.host,
		user: option.user,
		port: option.port || '3306',
		password: option.password,
		database: option.database
	}));
}

var sendResponse = function(httpResponse, body, status, description){
	var responseBody = JSON.stringify({
		status: status,
		result: body,
		description: description || ''
	});

	httpResponse.send(responseBody);
}

var queryFunctions = {
	'/subcribe': function(req, res){
		try{
			var email = req.body.email;
			var connection = createConnection();
			var sql = 'select * from f_email where email="' + email + '"';
			connection.query(sql, function(selectErr, selectResult){
				if( selectErr ){
					return;
				}
				if( selectResult.length ){
					sendResponse(res, '', 'Y');
					connection.end();
				}else{
					sql = 'insert into f_email values  (null, "' + email + '", "' + new Date().getTime() + '")';
					connection.query(sql, function(insertErr, insertResult){
						if( insertErr ){
							return;
						}
						sendResponse(res, insertResult, 'Y');
						connection.end();
					});
				}
			});
		}catch(e){
			sendResponse(res, '', 'N', '系统错误');
		}
	}
}


for(var i in queryFunctions){
	app.post(i, queryFunctions[i]);
}

app.listen(8000);
