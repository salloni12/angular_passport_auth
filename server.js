var express = require('express');
var app = express();
var passport=require('passport');
var login=require('./passport')(app,passport);

var mongoose=require('mongoose');

//connect to mongodb
mongoose.connect('mongodb://localhost:27017/users');

//on connection
mongoose.connection.on('connected',()=>{
    console.log("connected to database @mongodb at port 27017");
});

mongoose.connection.on('error',(err)=>{
    if (err){
        console.log('error in database'+err);
    }

});


  

app.use(express.static(__dirname));


app.get('*', (req, res) =>{

    return res.sendfile("index.html");
});

const port = process.env.PORT || 3000;
app.listen(port , () => console.log('App listening on port ' + port));

