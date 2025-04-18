// import ForgotPassword from "./pages/ForgotPassword/ForgotPassword";
import App from "./pages/Home/App";
import Register from "./pages/Register/Register";
import Login from "./pages/Login/Login";
import NotFoundPage from "./pages/NotFound/NotFound";
import ConfirmEmail from "./pages/ConfirmEmail/ConfirmEmail";
import PasswordResetRequest from "./pages/PasswordResetRequest/PasswordResetRequest";
import PasswordResetConfirm from "./pages/PasswordResetConfirm/PasswordResetConfirm";
import { NavBar } from "./components/Navbar/Navbar";

const routes = [
  {
    path: "/",
    element: <App />,
    errorElement: <NotFoundPage />,
  },
  {
    path: "/navbar",
    element: <NavBar />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/email/confirm/:key",
    element: <ConfirmEmail />,
  },
  {
    path: "/forgot-password",
    element: <PasswordResetRequest />,
  },
  {
    path: "/password-reset/confirm/:uid/:token",
    element: <PasswordResetConfirm />,
  },
];

export default routes;
