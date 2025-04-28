const app = require("./app");

app.listen(3000, (err) => {
  if (err) {
    console.error("Error starting server:", err);
    return;
  }
  console.log("Server is running on port 3000");
});
