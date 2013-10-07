
/**
 * Module dependencies.
 */


var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var http = require('http');
var path = require('path');
var passport = require('passport');
var TwitterStrategy = require('passport-twitter').Strategy
var twitter = require('ntwitter');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.set('jsonp callback', true);
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.cookieParser('your secret here'));
app.use(express.session());

app.use(passport.initialize());
app.use(passport.session());

app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
    app.use(express.errorHandler());
}

app.listen(app.get('port'), function(){
    console.log('Express server listening on port ' + app.get('port'));
});

// serialize, deserialize
passport.serializeUser(function(user, done){
    done(null, user);
});
passport.deserializeUser(function(obj, done){
    done(null, obj);
});


// Authenticate Twitter
var cskeys = {
        consumerKey: "4NTNxYcAuS55LmCbYyn9kA",
        consumerSecret: "lVtnrMzISrYQUscso7Bj7tAHTFdPJhXeFSSM5VbY",
        callbackURL: "http://127.0.0.1:3000/auth/twitter/callback"
    };

var ts = new TwitterStrategy(cskeys, function(token, tokenSecret, profile, done) {
	passport.session.accessToken = token;
	passport.session.accessTokenSecret = tokenSecret;
	passport.session.profile = profile;
	process.nextTick(function () {
		return done(null, profile);
    });
});

passport.use(ts);

app.get('/', passport.authenticate('twitter'));

app.get('/auth/loginfailed', function(req, res){
	res.send("Login failed.")
});

app.get('/auth/twitter/callback', passport.authenticate('twitter', {
    successRedirect: '/show_timeline',
    failureRedirect: '/auth/loginfailed'
}));




app.get('/home_timeline.json',     
function(req,res){
    ts._oauth.getProtectedResource('https://api.twitter.com/1.1/statuses/home_timeline.json', 'GET',
    passport.session.accessToken,
    passport.session.accessTokenSecret, function (err, data, response) {
			if(err) {
			    res.send(err, 500);
			    return;
            }
        res.send(JSON.parse(data));
    });        
});


app.get('/users/show.json',     
function(req,res){
    ts._oauth.getProtectedResource('https://api.twitter.com/1.1/friends/list.json', 'GET',
    passport.session.accessToken,
    passport.session.accessTokenSecret, function (err, data, response) {
			if(err) {
			    res.send(err, 500);
			    return;
            }
        res.send(JSON.parse(data));
    });        
});

app.get('/show_timeline', function(req,res){
    res.render('index');
});
    


/*

参考:
[10/2アクセス]
http://creator.cotapon.org/articles/node-js/node_js-oauth-passport-facebook-twitter
http://creator.cotapon.org/articles/node-js/node_js-oauth-twitter
http://kjunichi.cocolog-nifty.com/misc/2013/03/passport-twitte.html


セッションについて
http://tech-sketch.jp/2012/03/nodejs-oauth.html

process.NextTickについて
http://howtonode.org/understanding-process-next-tick
http://d.hatena.ne.jp/sasaplus1/20120507/1336396704

[10/7アクセス]
http://qiita.com/sckm/items/e6a7fd669e2367bc441f

*/