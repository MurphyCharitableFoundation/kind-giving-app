import ForgotPassword from "./pages/ForgotPassword/ForgotPassword";
import App from "./pages/Home/App";
import Login from "./pages/Login/Login";
import NotFoundPage from "./pages/NotFound/NotFound";
import ConfirmEmail from "./pages/ConfirmEmail/ConfirmEmail";

const routes = [
  {
    path: "/",
    element: <App />,
    errorElement: <NotFoundPage />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/forgot-password",
    element: <ForgotPassword />,
  },
  {
    path: "/email/confirm/:key",
    element: <ConfirmEmail />,
  },
];

export default routes;
