const app = require("express")();
const http = require("http").createServer(app);
const io = require("socket.io")(http);

let idCounter = 0

io.on("connection", (socket) => {
	socket.context = {
		name: `User${++idCounter}`
	}
// Сообщение приветствия
	io.emit('message', {
		user: "root",
		date: Date.now(),
		content: `Пользователь ${socket.context.name} присоеденился к чату` ,
	})
//
	socket.on("message", content => {
		io.emit('message', {
			user: socket.context.name,
			date: Date.now(),
			content,
		})
	});

	socket.on("setname", name => {
		socket.context.name = name
	})

	console.log("a user connected");
});

http.listen(3000, () => {
	console.log("listening on *:3000");
});
