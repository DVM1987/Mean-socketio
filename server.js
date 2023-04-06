var express = require("express");
var app = express();

app.use(express.static("public"));
app.set("view engine", "ejs");
app.set("views", "./views");

var server = require("http").Server(app);
var io = require("socket.io")(server);
app.io = io;
server.listen(3000);

var fs = require("fs");
fs.readFile("./config.json", function (err, data) {
  if (err) {
    console.log("load file error");
  } else {
    var obj = JSON.parse(data);
    // console.log(obj.domain);
    require("./routes/main")(app, obj);
  }
});
