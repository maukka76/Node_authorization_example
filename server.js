var app = require('express')();
var session = require('express-session');
//npm install acl
var acl = require('acl');
var conn = require('./database').connect(builAuthorization);
function builAuthorization(dbconn){
	acl = new acl(new acl.mongodbBackend(dbconn.connection.db, "acl_"));
	acl.allow([
    {
        roles:['guest','member','admin'],
        allows:[
            {resources:'blogs', permissions:'get'},
            {resources:['forums','news'], permissions:['get','put','delete']},
			{resources:['forums,blogs'],permissions:['get','post','put','delete']}
        ]
    },
    {
        roles:['gold','silver'],
        allows:[
            {resources:'cash', permissions:['sell','exchange']},
            {resources:['account','deposit'], permissions:['put','delete']}
        ]
    }
	],function(){

		console.log('ROLES ADDED');
		acl.addUserRoles('jim', 'admin');
		acl.addUserRoles('joe', 'guest');
		acl.addUserRoles('jane', 'member');
	});
	
}

app.use(session({
	secret:'secret',
	cookie:{maxAge:6000000}
}));

app.use(function(req,res,next){
	req.session.userId = 'jim';
	acl.allowedPermissions('jim', ['blogs','forums'], function(err, permissions){
    	console.log(permissions)
	})
	next();
});


app.get('/forums',function(req,res,next){
	acl.isAllowed(req.session.userId, 'forums', ['get'],function(err,ok){
		console.log(err);
		if(ok === true)
			res.send('You are authorized');
		else{
			res.send('Not authorized');
		}
	});
	
});

app.get('/blogs',function(req,res,next){
	acl.isAllowed(req.session.userId, 'blogs', ['get'],function(err,ok){
		console.log(err);
		if(ok === true)
			res.send('You are authorized');
		else
			res.send('Not authorized');
	});
	
});




app.listen(3000);