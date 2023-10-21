const express = require("express");
const cors = require("cors");

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.1lk0tsy.mongodb.net/?retryWrites=true&w=majority`;

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

    const database = client.db("productsDB");
    const productscollection = database.collection("products");

    const cartdatabase = client.db("cartDB");
    const cartcollection = cartdatabase.collection("cart");

    app.get("/cart", async (req, res) => {
      const getcartdata = cartcollection.find();
      const result = await getcartdata.toArray();
      
      res.send(result);
    });
    
    app.get("/cart/:id", async (req, res) => {
      const id = req.params.id
      const quairy = {_id: id}
      const result = await cartcollection.deleteOne(quairy)
      console.log(result);
      res.send(result);
    });

    app.get("/products", async (req, res) => {
      const allproducts = productscollection.find();
      const result = await allproducts.toArray();
      res.send(result);
    });

    app.get("/:brand/:id", async (req, res) => {
      const productid = req.params.id;
      const quary = { _id: new ObjectId(productid) };
      const filterdata = await productscollection.findOne(quary);

      res.send(filterdata);
    });

    app.get("/:brand", async (req, res) => {
      const brand = req.params.brand;
      const filterdata = productscollection.find({ brand: brand });
      const result = await filterdata.toArray();
      res.send(result);
    });

    app.post("/products", async (req, res) => {
      const products = req.body;
      const result = await productscollection.insertOne(products);
      res.send(result);
      console.log(products);
    });

    app.delete("/products/:id", async(req, res)=> {
        const id = req.params.id;
        const quairy = {_id: new ObjectId(id)}
        const result = await productscollection.deleteOne(quairy)
        res.send(result)
    })

    

    app.post("/cart", async (req, res) => {
      const addcart = req.body;
      const result = await cartcollection.insertOne(addcart);
      res.send(result);
    });

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
  res.send("hello");
});

app.listen(port, () => {
  console.log("running");
});
