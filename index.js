const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

const authRoute = require("./routes/auth")
const userRoute = require("./routes/user")
const incomeRoute = require("./routes/income")
const expenseRoute = require("./routes/expense")
const categoriesRoute = require("./routes/categories")

const app = express();
dotenv.config();

const cors=require("cors");
const corsOptions ={
    origin:'*',
    credentials:true,
    optionSuccessStatus:200,
}
app.use(cors(corsOptions))

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("DB Connection Successfull..");
  })
  .catch((err) => {
    console.log(err);
  });


app.use(express.json())
app.use('/api/auth', authRoute)
app.use('/api/user', userRoute)
app.use('/api/income', incomeRoute)
app.use('/api/expense', expenseRoute)
app.use('/api/categories', categoriesRoute)


app.listen(process.env.PORT || 5000, () => {
    console.log("Backend server is running..");
})