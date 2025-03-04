const mongoose = require("mongoose");
const app = require("./app");

const { DB_HOST, PORT } = process.env;
mongoose
  .connect(DB_HOST, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Database connection successful");
    app.listen(PORT, () => {
      console.log(`Server running. Use our API on port: ${PORT}`);
    });
  })
  .catch(error => {
    console.error("Database connection error:", error);
    process.exit(1);
  });
