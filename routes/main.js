const e = require("express");

module.exports = function (app, obj) {
  const io = app.io;
  var counting = 0;

  var currentUser = [];

  io.on("connection", function (socket) {
    console.log("new Connection " + socket.id);

    currentUser.push(socket.id);
    io.sockets.emit("server-send-all-currentUser", { arr: currentUser });
    // console.log(currentUser);

    socket.on("disconnect", function () {
      console.log(socket.id + " has been disconnected");
      currentUser = currentUser.filter((e) => e !== socket.id);
      //   console.log(currentUser);
      io.sockets.emit("server-send-all-currentUser", { arr: currentUser });
    });

    socket.on("client_send_to_server", function (data) {
      console.log(socket.id + " has been sent " + JSON.stringify(data));

      // ban cho tat ca client (Toan server)
      //   io.sockets.emit("send_to_client", { message: data.message });

      // ban cho sender
      //   socket.emit("send_to_client", { message: data.message });

      // send to 1 socket id
      io.to(data.receiver).emit("send_to_client", { message: data.message });
    });
  });

  app.get("/", function (req, res) {
    res.render("home", { params: obj });
  });

  app.get("/users", function (req, res) {
    res.json({ users: currentUser });
  });

  //   timeCounting();

  //   function timeCounting() {
  //     counting = counting + 1;
  //     console.log(counting);
  //     io.sockets.emit("server-send-counting", { time: counting });
  //     setTimeout(() => {
  //       timeCounting();
  //     }, 1000);
  //   }
};
