import { Typography } from "@mui/material";
import { Link } from "react-router-dom";

interface HeaderProps {
  children?: string;
}

const Header = ({ children }: HeaderProps) => {
  return (
    <div
      className="flex-row align-center"
      style={{ justifyContent: "space-between" }}
    >
      <Link to="/">
        <h1>Kind Giving App</h1>
      </Link>

      <nav>
        <ul className="flex-row gap20">
          <Link to="/login">
            <li>Login</li>
          </Link>

          <Link to="/register">
            <li>Signup</li>
          </Link>

          <Link to="/about">
            <li>About</li>
          </Link>

          <Link to="/faq">
            <li>FAQ</li>
          </Link>
        </ul>
      </nav>

      <Typography>{children}</Typography>
    </div>
  );
};

export default Header;
