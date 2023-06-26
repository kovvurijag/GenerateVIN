const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");

const app = express();
const port = 8000;

app.use(bodyParser.json());

let serialNumber = 1;

app.post("/search", (req, res) => {
  const { version, equipmentCode, yearOfIssue, placeOfProduction } = req.body;

  // Your logic to search for the next available serial number in the database

  // For demonstration purposes, we'll increment the serialNumber variable
  const nextSerialNumber = serialNumber++;

  res.json({ serialNumber: nextSerialNumber });
});

app.post("/add", (req, res) => {
  const { vin } = req.body;

  // Your logic to add the VIN number to the database

  res.json({ message: "VIN number added successfully" });
});

app.get("/list", (req, res) => {
  // Your logic to fetch the list of VIN numbers from the database

  // For demonstration purposes, we'll return a static list
  const vinList = [
    "00000022100000100",
    "00001422100001100",
    "00003722100000400",
    "00100022100000600",
    "00003623100000100",
    "00003823100000000",
    "00001422100001200",
    "00003123100000100",
    "00102722100000100",
    "00003722100000500",
    "00103822100000100",
  ];

  res.json({ vinList });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
