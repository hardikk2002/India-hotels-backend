const mongoose = require("mongoose");
//Connect to hotel Database
mongoose
  .connect(process.env.MONGO_CONNECTION_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    // useCreateIndex: true,
    // useFindAndModify: false,
  })
  .then(() => console.log("Mongodb connected."))
  .catch((err) => {
    console.log(err);
    console.log("Mongdb connection failed");
  });
