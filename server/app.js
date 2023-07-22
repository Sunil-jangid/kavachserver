const express = require("express");
const app = express();
const path = require("path");
const axios = require("axios");
const mysql = require("mysql2");
const { spawn } = require("child_process");
const links = ["XYZ.com", "ABC.com", "Hello.com","sss.com","assasa.com"];

const con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "N@thuram1974",
  database: "links",
});
async function checklink(link){
  try {
    const response = await axios.post("http://your-python-model-api", { link });
    const isObscene = response.data.isObscene;
    if (isObscene) {
      console.log(`Link ${link} contains obscene content.`);
    } else {
      console.log(`Link ${link} does not contain obscene content.`);
    }
}catch(error){
  console.error("ERROR WHILE CHECKING IN MODEL");
}
}
con.connect(function (error) {
  if (error) throw error;
  console.log("CONNECTED");
  for (const link of links) {
    storeLinkInDatabase(link);
  }
});

function storeLinkInDatabase(link) {
  con.query("SELECT * FROM links_table WHERE links = ?", [link], (error, results) => {
    if (error) {
      console.error("Error checking link in the database:", error);
    } else {
      if (results.length > 0) {
        console.log(`Link ${link} is already present in the database.`);
      } else {
        con.query("INSERT INTO links_table (links) VALUES (?)", [link], (insertError, insertResults) => {
          if (insertError) {
            console.error("Error storing link in the database:", insertError);
          } else {
            console.log(`Link ${link} stored in the database.`);
          }
        });
      }
    }
  });
}

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
