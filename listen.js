const app = require("./app");

const {PORT = 9090} = process.env

app.listen(PORT, (err) => {
  if (err) {
    console.error("Error starting server:", err);
    return;
  }
  console.log(`Server is running on port ${PORT}`);
});
