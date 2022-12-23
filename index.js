const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const { MongoClient, ObjectId } = require("mongodb");
const port = 3000;

// Set up default mongoose connection
const url = "mongodb+srv://godspeed:godspeed@cluster0.anwcftf.mongodb.net/test";
const client = new MongoClient(url);

app.use(
    bodyParser.urlencoded({
        extended: false,
    })
);

const dbName = "infoSystem";
let db;
client
  .connect()
  .then(async () => {
    db = client.db(dbName);
    console.log("Connected to Mongodb");
  })
  .catch((err) => {
    console.log(err);
    console.log("Unable to connect to Mongodb");
  });


app.get("/patients",(req, res) => {
  console.log("request");
  res.status(200).send("Patients Results");
})

app.get("/", (req, res) => {
  db.collection("patients")
    .find({})
    .toArray()
    .then((records) => {
      return res.json(records);
    })
    .catch((err) => {
      console.log("err");
      return res.json({ msg: "There was an error processing your query" });
    });
});

//Create a patient

app.post("/", (req, res) => {
    console.log(req.body);
    const {name,age,birthdate,address,gender} = req.body;
    db.collection("patients")
      .insertOne({name,age,birthdate,address,gender})
      .then((records) => {
        return res.json(records);
      })
      .catch((err) => {
        console.log(err);
        return res.json({ msg: "There was an error processing your query" });
      });
  });

  //Create prescriptions

  app.post("/prescriptions", (req, res) => {
    console.log(req.body);
    const {date,name,diagnosis,medications} = req.body;
    db.collection("prescriptions")
      .insertOne({date,name,diagnosis,medications})
      .then((records) => {
        return res.json(records);
      })
      .catch((err) => {
        console.log(err);
        return res.json({ msg: "There was an error processing your query" });
      });
  }); 

  //Delete a patient

  app.delete("/patients/:patient_no", (req, res) => {
    const _patient_no = req.params.patient_no;
    db.collection("patients")
      .deleteOne(
        {
          patient_no: _patient_no
        })
      .then((records) => {
        return res.json(records);
      })
      .catch((err) => {
        console.log(err);
        return res.json({ msg: "There was an error processing your query" });
      });
  });

  //Delete a prescription

  app.delete("/prescriptions/:_id", (req, res) => {
    const id = req.params._id;
    db.collection("prescriptions")
      .deleteOne(
        {
          _id: ObjectId(id)
        })
      .then((records) => {
        return res.json(records);
      })
      .catch((err) => {
        console.log(err);
        return res.json({ msg: "There was an error processing your query" });
      });
  }); 

  //Add a medication to the prescription

  app.put("/prescriptions/:_id", (req, res) => {
    const _id = req.params._id;
    const medications = req.body.medications;
    db.collection("prescriptions")
      .updateOne(
        {
          _id: ObjectId(_id)
        },
        {
          $push: {
            medications
          }
        }
      )
      .then((records) => {
        return res.json(records);
      })
      .catch((err) => {
        console.log(err);
        return res.json({ msg: "There was an error processing your query" });
      });
  });

  //Remove a medication from a prescription

  app.put("/medications/:_id", (req, res) => {
    const _id = req.params._id;
    const medications = req.body.medications;
    db.collection("prescriptions")
      .updateOne(
        {
          _id: ObjectId(_id)
        },
        {
          $pull: {
            medications
          }
        }
      )
      .then((records) => {
        return res.json(records);
      })
      .catch((err) => {
        console.log(err);
        return res.json({ msg: "There was an error processing your query" });
      });
  });

  //update patients

  app.put("/:_id", (req, res) => {
    const id = req.params._id;
    const {name,age,birthdate,address,gender} = req.body;
    db.collection("patients")
      .updateOne(
        {
          _id: ObjectId(id)
        },
        {
          $set: req.body
        }
      )
      .then((records) => {
        return res.json(records);
      })
      .catch((err) => {
        console.log(err);
        return res.json({ msg: "There was an error processing your query" });
      });
  });

  app.delete("/:_id", (req, res) => {
    const id = req.params._id;
    db.collection("patients")
      .deleteOne(
        {
          _id: ObjectId(id)
        })
      .then((records) => {
        return res.json(records);
      })
      .catch((err) => {
        console.log(err);
        return res.json({ msg: "There was an error processing your query" });
      });
  }); 

app.listen(port, () => {
  console.log('Example app listening on port ${port}');
});