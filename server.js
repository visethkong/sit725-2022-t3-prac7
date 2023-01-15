require('dotenv').config()

var express = require("express")
var app = express()
var cors = require("cors")
let projectCollection;
let dbConnect = require("./dbConnect");
let projectRoutes = require("./routes/projectRoutes")

let http = require('http').createServer(app);
let io = require('socket.io')(http);

app.use(express.static(__dirname+'/public'))
app.use(express.json());
app.use(express.urlencoded({extends: false}));
app.use(cors())
app.use('/api/projects', projectRoutes)

app.get('/addTwoNumbers/:firstNumber/:secondNumber', function(req,res,next)
{
    var firstNumber = parseInt(req.params.firstNumber)
    var secondNumber = parseInt(req.params.secondNumber)
    var result = firstNumber + secondNumber || null
    if(result == null) {
        res.json({result: result, statusCode: 400}).status(400)
    }
    else { res.json({result: result, statusCode: 200}).status(200) } 

})


io.on('connection', (socket)=>{
    console.log('a user connected');
    socket.on('disconnect', ()=> {
        console.log('user disconnected');
    });
    setInterval(()=>{
        socket.emit('number', parseInt(Math.random()*10));
    }, 1000);
});


// //mongoDb connection...
// const MongoClient = require('mongodb').MongoClient;

// //add database connection...
// const uri = 'mongodb+srv://seth:seth@cluster0.tkqmfcm.mongodb.net/?retryWrites=true&w=majority'
// const client = new MongoClient(uri, {useNewUrlParser: true})

// //insert project...
// const insertProjects = (project, callback) => {
//     projectCollection.insert(project,callback);
// }

// const getProjects = (callback) => {
//     projectCollection.find({}).toArray(callback);
// }

// const createCollection = (collectionName) => {
//     client.connect((err,db) => {
//         projectCollection = client.db().collection(collectionName);
//         if(!err) {
//             console.log('MongoDB Connected')
//         }
//         else {
//             console.log("DB Error: ", err);
//             process.exit(1);
//         }
//     })
// }

// const cardList = [
//     {
//         title: "Kitten 2",
//         image: "images/kitten-2.jpg",
//         link: "About Kitten 2",
//         description: "Demo desciption about kitten 2"
//     },
//     {
//         title: "Kitten 3",
//         image: "images/kitten-3.jpg",
//         link: "About Kitten 3",
//         description: "Demo desciption about kitten 3"
//     }
// ]

// app.get('/api/projects',(req,res) => {
//     getProjects((err, result) => {
//         if(err) {
//             res.json({statusCode: 400, message: err})
//         }
//         else {
//             res.json({statusCode: 200, message:"Success", data: result})
//         }
//     })
// })

// // post api.....
// app.post('/api/projects', (req,res) => {
//     console.log("New Project added", req.body)
//     var newProject = req.body;
//     insertProjects(newProject, (err, result) => {
//         if(err) {
//             res.json({statusCode: 400, message: err})
//         }
//         else {
//             res.json({statusCode: 200, message:"Project Successfully added", data: result})
//         }
//     })
// })

var port = process.env.port || 3000;
http.listen(port, ()=>{
    console.log("App listening to: http://localhost:"+port)
    // createCollection("Pets")
})