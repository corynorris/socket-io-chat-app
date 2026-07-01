import { useEffect, useRef } from "react";

interface Message {
  author: string;
  text: string;
}

interface MessageListProps {
  messages: Message[];
}

export default function MessageList({ messages }: MessageListProps) {
  const listRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <header>
      <ul className="message-list" ref={listRef}>
        {messages.map((msg, i) => (
          <li key={i}>
            <span className="author">{msg.author}</span> {msg.text}
          </li>
        ))}
      </ul>
    </header>
  );
}
