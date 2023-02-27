const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();
const port = process.env.PORT || 5000;
const app = express();
app.use(cors());
app.use(express.json());

// DB_USER=jkrBookShop
// DB_PASS=eqWC50TP9rkUxKUB


// -----> mongodb uri
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.iea9q.mongodb.net/?retryWrites=true&w=majority`

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

// mongo compass uri
// const uri = 'mongodb://0.0.0.0:27017/'
// const client = new MongoClient(uri);

async function run() {
  try {
    const booksCollection = client.db("jkrBookShop").collection("books");

    // add a book
    app.post("/book", async (req, res) => {
      const service = req.body;
      const result = await booksCollection.insertOne(service);
      res.send(result);
    });

    // view all books
    app.get("/books", async (req, res) => {
      const query = {};
      const cursor = booksCollection.find(query);
      const data = await cursor.toArray();
      res.send(data);
    });

    //view single book detail
    app.get("/singleBook/:id", async (req, res) => {
      const query = { _id: ObjectId(req.params.id) };
      const data = await booksCollection.findOne(query);
      res.send(data);
    });

    //update single book
    app.put('/updateBook/:id', async (req, res) => {
      const id = req.params.id;
      const data = req.body;
      console.log(data)
      const query = { _id: ObjectId(id) };
      const options = { upsert: true };
      const updateDoc = {
        $set: {
          ... (data.title && { title: data.title }),
          ... (data.author && { author: data.author }),
          ... (data.publisher && { publisher: data.publisher }),
          ... (data.language && { language: data.language }),
          ... (data.category && { category: data.category }),
          ... (data.subject && { subject: data.subject }),
          ... (data.image && { image: data.image })
        }
      }
      const result = await booksCollection.updateOne(query, updateDoc, options);
      res.json(result)
    })

    // Delete a single book
    app.delete("/book/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await booksCollection.deleteOne(query);
      res.send(result);
    });
  } finally {
    // console.log(client)
  }
}

run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Welcome to JKR Bookshop");
});

app.listen(port, () => {
  console.log("Listening to port", port);
});