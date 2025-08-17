const express = require('express')
const app = express()
const port = 3333

const cors = require("cors")
const bodyParser = require("body-parser")
const { connect } = require("./db.js")
const priestRoutes = require("./routes/priest.js")

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))

app.use(cors())


connect().then((connection) => {
    console.log("Connected to the database.")
})

app.use("/priests", priestRoutes.router)

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(port, () => {
    console.log(`Priest Directory App is now listening on port ${port}`)
})