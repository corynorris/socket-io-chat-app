interface UserListProps {
  users: { username: string }[];
}

export default function UserList({ users }: UserListProps) {
  return (
    <footer>
      <ul className="user-list">
        {users.map((user, i) => (
          <li key={i}>
            <span className="author">{user.username}</span>
          </li>
        ))}
      </ul>
    </footer>
  );
}
