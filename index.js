const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://root:root123@cluster0.7co24xu.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});
let db= null
async function run() {
      // Connect the client to the server	(optional starting in v4.7)
      await client.connect();
      // Send a ping to confirm a successful connection
      //await client.db("mywebsite").command({ ping: 1 });
      db= client.db("board-system");
      console.log("資料庫連線成功");
};
run();
//網站伺服器基礎設定
const express= require("express");
const app= express();
const session = require("express-session");
app.use(session({
    secret:"abcdef",
    resave:false,
    saveUninitialized:true
    }));
    
app.set("view engine", "ejs");
app.set("views", "./views");
//將靜態檔案名稱 對應到網址 http://localhost:3000/檔案名稱
app.use(express.static("public"));
//讓程式後端支援POST方法 
app.use(express.urlencoded({extended:true}));

app.get("/",async function(req, res){
    const collection= db.collection("messages");
    let result= await collection.find({}).sort({timestamp:-1});

    let messages=[];
    await result.forEach(element => {
        messages.push(element);
        
     });
    res.render("index.ejs", {messages:messages});
    }); 
//req 要在前面！！
app.post("/leave-message",async function(req, res){
    
    const name=req.body.name; 
    const message= req.body.message;
    const collection= db.collection("messages")
    
    let date_ob= new Date();
    let date = ("0" + date_ob.getDate()).slice(-2);
// current month
let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
// current year
let year = date_ob.getFullYear();
// current hours
let hours = date_ob.getHours();
// current minutes
let minutes = date_ob.getMinutes();
// current seconds
let seconds = date_ob.getSeconds();
let cur_time= year + "-" + month + "-" + date + " " + hours + ":" + minutes + ":" + seconds;
result= await collection.insertOne({
    name:name,
    message:message,
    timestamp: cur_time
});  
res.redirect("/");

});

app.listen(3000, function(){
        console.log("Server started");
     });
        
