const express = require('express');
// Include bodyParser for middleware********************************
const bodyParser = require('body-parser');
// include objectId for get objectId form mongodb
const ObjectId = require('mongodb').ObjectId;

const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://rpUser:lTpgdd9D05khtKFU@cluster0.v8nsc.mongodb.net/rpmongodb?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

const app = express();

// create application/json parser
app.use(bodyParser.json());
// create application/x-www-form-urlencoded parser
app.use(bodyParser.urlencoded({extended: false}));

app.get('/', (req, res) => {
    // In this way i will send any file********************************
     res.sendFile(__dirname + '/index.html')

    // res.send("Hello i am working")
})


client.connect(err => {
  const collection = client.db("rpmongodb").collection("products");
  // Insert Data into MongoDB**************Add to Docs******************  

//  (R) get--> api create & store data in this api from MONGODB
// By limit show dataLimit Like-->  find({}).limit(2)
app.get('/products', (req, res) => {
collection.find({})
.toArray((err, documents) =>{
    res.send(documents);
})
}) 


// (U)  get by api id for Show update data [dynamic id] --------------------{index.html}
app.get("/product/:id", (req, res) => {
    collection.find({_id: ObjectId(req.params.id)})
    .toArray((err, documents) =>{
        res.send(documents[0]);
    })
});

// (U) After Updating input field Submit into Mongodb***********
app.patch("/update/:id", (req, res) => {
  collection.updateOne({_id: ObjectId(req.params.id)},
  {
    $set: { price: req.body.price, quantity: req.body.quantity }
  })
  .then(result => {
    // After Updating show Data UI*****
    res.send(result.modifiedCount > 0);
  })

  
})




//   (C)-->post create
  app.post("/addProduct", (req, res) => {
      const product = req.body;
    //   Transfer Data input field to MONGODB*******
      collection.insertOne(product)
      .then(result => {
        // *** After add product directly show this product present UI
         res.redirect('/')
        // res.send('success')
      })

    //   console.log(product);
  })



// (D)--> delete data from Database
app.delete("/delete/:id", (req, res) => {
    collection.deleteOne({_id: ObjectId(req.params.id)})
    .then( result => {
      // Delete product from UI********
        res.send(result.deletedCount > 0);
    })
});



//   const product = {
//       name: "honey",
//       price: 50,
//       quantity: 100
//   }
//   collection.insertOne(product)
//   .then(result => {
//     console.log("Honey is add to mongodb");
//   })


   console.log("Database connecting")
  // perform actions on the collection object
    //  client.close(); remove it here@!!!!
});


app.listen(3000);