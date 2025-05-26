// import ForgotPassword from "./pages/ForgotPassword/ForgotPassword";
import App from "./pages/Home/App";
import Register from "./pages/Register/Register";
import Login from "./pages/Login/Login";
import NotFoundPage from "./pages/NotFound/NotFound";
import ConfirmEmail from "./pages/ConfirmEmail/ConfirmEmail";
import PasswordResetRequest from "./pages/PasswordResetRequest/PasswordResetRequest";
import PasswordResetConfirm from "./pages/PasswordResetConfirm/PasswordResetConfirm";
import Causes from "./pages/Causes/Causes";
import CauseDetails from "./pages/Causes/[id]/CauseDetails";
import CreateCause from "./pages/Causes/Create/CreateCause";
import EditCause from "./pages/Causes/EditCause/EditCause";

const routes = [
  {
    path: "/",
    element: <App />,
    errorElement: <NotFoundPage />,
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
  {
    path: "/causes",
    element: <Causes />,
  },
  {
    path: "/causes/create",
    element: <CreateCause />,
  },
  {
    path: "/causes/:causeId",
    element: <CauseDetails />,
  },
  {
    path: "/causes/:causeId/edit",
    element: <EditCause />,
  },
];

export default routes;
