const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

// const uri =
//   `mongodb+srv://${process.env.DB_KEY}:${process.env.DB_PASS}@cluster0.dyqxkty.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

const uri = "mongodb://localhost:27017";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    // const database = client.db("productDB");
    // const productCollection = database.collection("products");

    const productCollection = client.db("productDB").collection("products");

    app.get('/products', async(req, res) => {
      const query = productCollection.find();
      const result = await query.toArray();
      res.send(result)
    });

    app.get("/myProduct/:email", async (req, res) => {
      const email = req.params.email;
      const result = await productCollection.find({ email }).toArray();
      res.send(result);
    });

    app.get("/singleProduct/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await productCollection.findOne(query);
      res.send(result);
    });

    app.post("/addProducts", async (req, res) => {
      const products = req.body;
      const result = await productCollection.insertOne(products);
      res.send(result);
    });

    app.put("/updateProduct/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const updatedProduct = {
        $set: {
          name: req.body.name,
          image: req.body.image,
          brandName: req.body.brandName,
          type: req.body.type,
          price: req.body.price,
          rating: req.body.rating
        },
      };
      const result = await productCollection.updateOne(filter, updatedProduct);
      res.send(result);
    });

    app.delete('/delete/:id', async(req, res) => {
      const id = req.params.id;
      const query = {_id: new ObjectId(id)};
      const result = await productCollection.deleteOne(query);
      res.send(result);
    })
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("hello world form brand shop");
});

app.listen(port, () => {
  console.log(`BrandShop is running on port: ${port}`);
});
