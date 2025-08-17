//[Dependencies and Modules] 
const express = require('express');
// const passport = require("passport");
const priestController = require("../controllers/priest")

//[Routing Component] 
const router = express.Router();

router.get("/allPriest", priestController.getAllPriests)

module.exports = {router}