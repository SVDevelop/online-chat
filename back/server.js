const express = require("express")
const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http);
const session = require('express-session')
const path = require('path');
const { Session } = require("inspector");

// const port = []
const port = process.env.NODE_ENV === 'production' ? 80 : 3000

let messages = []

let idCounter = 0

// use session middleware
const sessionMidleware = session({
	secret: "keyboard cat",
	cookie: {
		maxAge: 60000
	},
})

app.use(sessionMidleware)

app.get("/", function (req, res, next) {
	if (!req.session.userId) {
		req.session.userId = idCounter++
		req.session.userName = `User${req.session.userId}`
		req.session.first = true
		req.session.save()
	}

	next()
})

app.use(express.static(path.join(__dirname, "../front")))

io.use((socket, next) => {
	sessionMidleware(socket.request, {}, next)
})

if (process.env.NODE_ENV === "development") {
	const { session } = socket.request.session
	io.use((socket, next) => {
		if (!session.userId) {
			session.userId = idCounter++
			session.userName = `User${session.userId}`
			session.save()
		}

		next()
	})
}

io.on("connection", (socket) => {
	const {	session	} = socket.request

	if (messages.length) {
		for (const message of messages) {
			socket.emit('message', message)
		}
	}

	if (session.req.first) {
		socket.emit('message', {
			user: "root",
			date: Date.now(),
			content: `Пользователь ${session.userName} присоеденился к чату`,
		})

		session.first = false
		session.save()
	} else {
		socket.emit('message', {
			user: "root",
			date: Date.now(),
			content: `Пользователь ${session.userName} снова с нами`,
		})

		session.save()
	}

	socket.on("message", content => {
		const message = {
			user: session.userName,
			date: Date.now(),
			content,
		}
		io.emit('message', message)

		messages.push(message)

		if (messages.length > 15) {
			messages.slice(-15)
		}
	});

	socket.on("setname", name => {
		const curentUserName = session.userName
		session.userName = name
		console.log(messages, session.userName, curentUserName )
		messages = messages.map((message) => {
			// { user: 'User0', date: 1601547165367, content: 'sdf' },
			if(message.user === curentUserName) {
				message.user = name
				return message
			} else {
				return message
			}
		})

		session.save()
	})

	console.log(`a user:${session.userName} connected`);
});

http.listen(port, () => {
	console.log(`listening on *:${port}`);
});