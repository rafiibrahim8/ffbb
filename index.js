let bodyParser = require('body-parser');
let express = require('express');
let mongoose = require('mongoose');
let {PythonShell} = require('python-shell')
let http = require('http');
let port = 65004;

let app = express();
app.use(express.static('static'));
app.use(bodyParser.urlencoded({extended:false}));

mongoose.connect('mongodb://localhost:27017/fbmon', { useNewUrlParser: true, useUnifiedTopology: true });
let UserModel = mongoose.model('Users', new mongoose.Schema({
    userId: String,
    percent_online: Number,
    avg_hours_per_day: Number,
    total_online_hours: Number,
    longest_online: Number,
    total_record_hours: Number,
    longest_online_between: String,
    rank_mf: Number,
    online_by_day_ow_x: String,
    online_by_day_ow_y: String,
    online_by_date_x: String,
    online_by_date_y: String,
    user_name: String
}
));

let MetaModel = mongoose.model('Metas', new mongoose.Schema({name: String, value: String}));
let FinderModel = mongoose.model('Finders', new mongoose.Schema({input_x: String, output_y: String}));

app.get('/', function(req,res){
    MetaModel.find({name:['db_last_update','ana_start_date']}, function (error, result) {
        temp_var = {}
        result.forEach(i=>{
            temp_var[i.name] = i.value;
        });
        console.log(temp_var);
        
        res.render('home.pug', temp_var);
    });
});

app.get('/search', function (req, res) {
    if (!req.query.q) {
        res.render('404.pug');
        return;
    }

    UserModel.findOne({ userId: req.query.q }, function (error, result) {
        if(result == null){
            res.render('404.pug');
        }
        else{
            res.render('index.pug', result);
        }
    });
});

app.post('/qq', function(req,res){
    if(!req.body.query){
        res.redirect('/400');
        return;
    }

    PythonShell.run('helper.py', {args:[req.body.query]},function(err, pyResult){
        if(pyResult == null){
            res.redirect('/unknown');
            return;
        }

        FinderModel.findOne({ input_x: pyResult[0] }, function (error, result) {
            if(result == null){
                res.redirect('/unknown');
            }
            else{
                res.redirect('/search?q=' + result.output_y);
            }
        });
    });
});

app.get('/unknown', function(req,res){
    res.render('unknown.pug');
});

app.get('/400', function(req,res){
    res.end('You have sent an invalid request.');
});

app.get('/robots.txt', function(req,res){
    res.end('User-agent: *\nDisallow: /\n');
});

app.get('/favicon.ico', function(req,res){
    res.sendFile('static/img/laugh_wink.ico',{root:'.'});
});

app.get('*', function (req, res) {
    res.render('404.pug');
});

let httpServer = http.createServer(app);

httpServer.listen(port,'127.0.0.1');
console.log('http://localhost:' + port);
