const express = require('express');
const bodyParser = require('body-parser');
const https = require("https");
const app = express();
const client = require("@mailchimp/mailchimp_marketing");
// require('dotenv').config()
// const APIKEYVALUE=process.env.APIKEYVALUE;
// const SERVERVALUE=process.env.SERVERVALUE;
// const LISTKEY=process.env.LISTKEY;

// const APIKEYVALUE=config.APIKEYVALUE;
// const SERVERVALUE=config.SERVERVALUE;
// const LISTKEY=config.LISTKEY;
client.setConfig({
  apiKey: APIKEYVALUE,
  server: SERVERVALUE,
});
app.use(express.static("public"));
app.use(bodyParser.urlencoded({
  extended: true
}));

app.get("/", function(req, res) {
  res.sendFile(__dirname + "/signup.html");
});

app.post("/", function(req, res) {
  const firstname = req.body.firstname;
  const lastname = req.body.lastname;
  const email = req.body.email;
  const run = async () => {
    try {
      const response = await client.lists.addListMember(LISTKEY, {
        email_address: email,
        status: "subscribed",
        merge_fields: {
          FNAME: firstname,
          LNAME: lastname
        },
      });
      console.log(response);
      res.sendFile(__dirname+"/success.html");
    } catch (e) {
      console.log(e);
      res.sendFile(__dirname+"/failure.html");
    }
  };
  run();

});

app.post("/failure",function(req,res){
  res.redirect("/");
});
app.listen(process.env.PORT || 3000, function() {
  console.log("Server connected");
});
