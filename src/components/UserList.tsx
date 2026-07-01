interface UserListProps {
  users: { username: string }[];
}

export default function UserList({ users }: UserListProps) {
  return (
    <footer>
      {users.length === 0 ? (
        <p className="no-users">No other users online</p>
      ) : (
        <ul className="user-list">
          {users.map((user, i) => (
            <li key={i}>
              <span className="author">{user.username}</span>
            </li>
          ))}
        </ul>
      )}
    </footer>
  );
}
