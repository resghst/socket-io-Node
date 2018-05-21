var http = require("http");
var url = require('url');
var fs = require('fs');
var io = require('socket.io'); // 加入 Socket.IO
let filepath  = './playlist/playlist.json'

var server = http.createServer(function(request, response) {
  console.log('Connection');
  let initplaylist ={
      'data': [],
      'currentposit': 0,
      'novideo': true,
      'videotime': new Date(),
      'push': (id)=> playlist.data.push(id),
      'deletevideo': (id)=>	playlist.data.push(id)
  }
  fs.readFile( filepath , 'utf8', function (err, buffer) { 
    buffer = JSON.parse(buffer)
    if(Object.keys(buffer).length === 0) fs.writeFile( filepath , JSON.stringify(initplaylist), 'utf8')
  })
  var path = url.parse(request.url).pathname;
 
  switch (path) {
    case '/':
      response.writeHead(200, {'Content-Type': 'text/html'});
      response.write('Hello, World.');
      response.end();
      break;
    case '/socket.html':
      fs.readFile(__dirname + path, function(error, data) {
        if (error){
          response.writeHead(404);
          response.write("opps this doesn't exist - 404");
        } else {
          response.writeHead(200, {"Content-Type": "text/html"});
          response.write(data, "utf8");
        }
        response.end();
      });
      break;
    default:
      response.writeHead(404);
      response.write("opps this doesn't exist - 404");
      response.end();
      break;
  }
});

var serv_io = io.listen(server);
// serv_io.set('log level', 1); // 關閉 debug 訊息

serv_io.sockets.on('connection', function(socket) {
  let initplaylist ={ }
  setInterval(function() {
    fs.readFile( filepath , 'utf8', function(err, buffer){  initplaylist = JSON.parse(buffer) })
    socket.emit('date', initplaylist);
  }, 1000);

  // 接收來自於瀏覽器的資料
  socket.on('client_data', function(data) {
    process.stdout.write(data.letter);
  });
});

server.listen(8001);






// var sleep = (milliseconds)=>{
//   var start = new Date().getTime();
//   for (var i = 0; i < 1e7; i++)
//     if ((new Date().getTime() - start) > milliseconds){
//       console.log("waiting")
//       break 
//       }
//   return new Date()
// }