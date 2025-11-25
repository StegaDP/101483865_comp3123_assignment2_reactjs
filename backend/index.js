const express = require('express');
const app = express()
const port = 8000
const userRouter = require('./routes/user')
const employeeRouter = require('./routes/employee')
const mongoose = require("mongoose");

app.use(express.json())

mongoose.connect("mongodb://root:770088@mongodb:27017/assignment2?authSource=admin").then(()=>console.log("Connected to MongoDB")).catch((err)=>console.log(`Error connecting to MongoDB: ${err.message}`));

app.use("/user", userRouter)
app.use("/emp", employeeRouter)

app.get('/', (req, res) => {
  res.send('hello world')
})


app.listen(port, () => {
  console.log(`Web Server is listening on port ${port}`)
})