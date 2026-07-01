import { useEffect, useState } from "react";
import socket from "./socket";
import UsernameModal from "./components/UsernameModal";
import MessageList from "./components/MessageList";
import MessageInput from "./components/MessageInput";
import UserList from "./components/UserList";
import "./App.css";

interface Message {
  author: string;
  text: string;
}

interface ChatUser {
  username: string;
}

export default function App() {
  const [username, setUsername] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [users, setUsers] = useState<ChatUser[]>([]);
  const [menuVisible, setMenuVisible] = useState(true);

  useEffect(() => {
    socket.on("users", (serverUsers: ChatUser[]) => {
      setUsers(serverUsers);
    });

    socket.on("chat message", (msg: Message) => {
      setMessages((prev) => [...prev, msg]);
    });

    socket.on("user joined", (joinedUser: string) => {
      setUsers((prev) => [...prev, { username: joinedUser }]);
    });

    socket.on("user left", (leftUser: string) => {
      setUsers((prev) => prev.filter((u) => u.username !== leftUser));
    });

    return () => {
      socket.off("users");
      socket.off("chat message");
      socket.off("user joined");
      socket.off("user left");
    };
  }, []);

  const handleUsernameSet = (name: string) => {
    setUsername(name);
  };

  const handleSend = (text: string) => {
    setMessages((prev) => [...prev, { author: username!, text }]);
  };

  const toggleMenu = () => {
    if (window.innerWidth <= 480) {
      setMenuVisible((v) => !v);
    }
  };

  if (!username) {
    return <UsernameModal onUsernameSet={handleUsernameSet} />;
  }

  const menuClass = menuVisible ? "show-users" : "";

  return (
    <div className="chat-app container">
      <section className={`messages-container ${menuClass}`}>
        <MessageList messages={messages} currentUsername={username} />
        <MessageInput onSend={handleSend} />
      </section>
      <section
        id="users"
        className={`users-container ${menuClass}`}
        onClick={toggleMenu}
      >
        <header>
          {menuVisible ? (
            <h2>Users</h2>
          ) : (
            <div className="close-menu">
              <i className="arr-left" />
            </div>
          )}
        </header>
        {menuVisible && <UserList users={users} />}
      </section>
    </div>
  );
}
