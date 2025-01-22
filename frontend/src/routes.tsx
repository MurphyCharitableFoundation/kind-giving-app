import App from "./pages/Home/App";
import NotFoundPage from "./pages/NotFound/NotFound";

const routes = [
  {
    path: "/",
    element: <App />,
    errorElement: <NotFoundPage />,
  },
];

export default routes;
