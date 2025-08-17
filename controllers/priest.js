//[Dependencies and Modules] 
const express = require('express');
// const passport = require("passport");
const db = require("../db.js")

//[Routing Component] 
const router = express.Router();

const getAllPriests = async (req, res) => {
    const query = "SELECT * FROM [Diocese of Novaliches]..Priest";
    const values = [];
    const paramNames = [];
    const isStoredProcedure = false;

    try {
        const returnValue = await db.executeQuery(query, values, paramNames, isStoredProcedure);

        // Check if the result is valid and has a recordset
        if (!returnValue || !returnValue.recordset) {
            console.log("No valid result or recordset returned.");
            // Send a 500 or 404 response and return to prevent further execution
            return res.status(500).send({ message: "An unexpected result was returned." });
        }

        // Check if the recordset is empty
        if (returnValue.recordset.length === 0) {
            console.log("No records found.");
            return res.status(200).send({ result: [], message: "No records found" });
        }

        console.log("this is the value:", returnValue.recordset);
        return res.status(200).send({ result: returnValue.recordset });

    } catch (error) {
        console.error("Error fetching Priests:", error);
        return res.status(500).send({ message: "An error occurred on the server." });
    }
};

module.exports = {
    getAllPriests
}