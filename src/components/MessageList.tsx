import { useEffect, useRef } from "react";

interface Message {
	author: string;
	text: string;
}

interface MessageListProps {
	messages: Message[];
	currentUsername: string | null;
}

export default function MessageList({
	messages,
	currentUsername,
}: MessageListProps) {
	const listRef = useRef<HTMLUListElement>(null);

	useEffect(() => {
		if (listRef.current) {
			listRef.current.scrollTop = listRef.current.scrollHeight;
		}
	}, [messages]);

	return (
		<header>
			<ul className="message-list" ref={listRef}>
				{messages.map((msg, i) => {
					const isMine = msg.author === currentUsername;
					return (
						<li key={i} className={isMine ? "message-mine" : ""}>
							<span className="author">{msg.author}</span> {msg.text}
						</li>
					);
				})}
			</ul>
		</header>
	);
}
