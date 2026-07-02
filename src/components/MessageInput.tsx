import { useState } from "react";
import socket from "../socket";

interface MessageInputProps {
	onSend: (text: string) => void;
}

export default function MessageInput({ onSend }: MessageInputProps) {
	const [input, setInput] = useState("");

	const handleSend = () => {
		const trimmed = input.trim();
		if (!trimmed) return;

		onSend(trimmed);
		socket.emit("send message", trimmed);
		setInput("");
	};

	return (
		<footer>
			<form
				className="form chat-input"
				onSubmit={(e) => {
					e.preventDefault();
					handleSend();
				}}
			>
				<button className="btn" type="submit">
					Send
				</button>
				<div className="input-wrapper">
					<input
						className="input"
						value={input}
						onChange={(e) => setInput(e.target.value)}
						autoComplete="off"
					/>
				</div>
			</form>
		</footer>
	);
}
