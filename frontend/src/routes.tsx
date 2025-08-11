// import ForgotPassword from "./pages/ForgotPassword/ForgotPassword";
import App from "./pages/Home/App";
import Register from "./pages/Register/Register";
import Login from "./pages/Login/Login";
import NotFoundPage from "./pages/NotFound/NotFound";
import ConfirmEmail from "./pages/ConfirmEmail/ConfirmEmail";
import PasswordResetRequest from "./pages/PasswordResetRequest/PasswordResetRequest";
import PasswordResetConfirm from "./pages/PasswordResetConfirm/PasswordResetConfirm";
import ProjectManagement from "./pages/ProjectManagement/ProjectManagement";
import ProjectDetails from "./pages/ProjectManagement/ProjectDetails";
import Causes from "./pages/Causes/Causes";
import CauseDetails from "./pages/Causes/[id]/CauseDetails";
import CreateCause from "./pages/Causes/Create/CreateCause";
import EditCause from "./pages/Causes/[id]/EditCause/EditCause";
import PasswordVerificationCode from "./pages/PasswordVerificationCode/PasswordVerificationCode";

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
    path: "/forgot-password/verification-code",
    element: <PasswordVerificationCode />,
  },
  {
    path: "/password-reset/confirm/:uid/:token",
    element: <PasswordResetConfirm />,
  },
  {
    path: "/projects",
    element: <ProjectManagement />,
  },
  {
    path: "/projects/:projectId",
    element: <ProjectDetails />,
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
