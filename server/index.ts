import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const http = createServer(app);
const io = new Server(http);

// Serve built Vite assets in production
const distPath = path.resolve(__dirname, "../../dist");
app.use(express.static(distPath));
app.get("*", (_req, res) => {
	res.sendFile(path.join(distPath, "index.html"));
});

interface ChatUser {
	username: string;
}

interface ChatSocket {
	username?: string;
}

const users: ChatUser[] = [];

const MAX_USERNAME_LENGTH = 20;
const MAX_MESSAGE_LENGTH = 500;

function sanitize(str: string): string {
	return str.replace(/</g, "&lt;").replace(/>/g, "&gt;").trim();
}

io.on("connection", (socket) => {
	let userSet = false;

	socket.on("join chat", (rawUsername: string) => {
		if (userSet) return;

		const username = sanitize(rawUsername).slice(0, MAX_USERNAME_LENGTH);
		if (!username) return;

		userSet = true;
		(socket as unknown as ChatSocket).username = username;
		users.push({ username });

		socket.broadcast.emit("user joined", username);
		console.log("user joined: " + username);
	});

	socket.on("disconnect", () => {
		const username = (socket as unknown as ChatSocket).username;
		if (!username) return;

		const index = users.findIndex((u) => u.username === username);
		if (index >= 0) {
			users.splice(index, 1);
			socket.broadcast.emit("user left", username);
			console.log("user left: " + username);
		}
	});

	socket.on("send message", (rawMessage: string) => {
		const message = sanitize(rawMessage).slice(0, MAX_MESSAGE_LENGTH);
		if (!message) return;

		const username = (socket as unknown as ChatSocket).username;
		if (!username) return;

		socket.broadcast.emit("chat message", {
			author: username,
			text: message,
		});
	});

	socket.emit("users", users);
});

const port = process.env.PORT || 3000;

http.listen(port, () => {
	console.log("listening on localhost:" + port);
});
