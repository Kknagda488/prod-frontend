import { lazy } from "react";

// project imports
import Loadable from "../components/ui-component/Loadable";
import MinimalLayout from "../layout/MinimalLayout";

// login option 3 routing
const AuthLogin3 = Loadable(lazy(() => import("../pages/LoginPage")));
// const AuthRegister3 = Loadable(lazy(() => import('views/pages/authentication/authentication3/Register3')));

// ==============================|| AUTHENTICATION ROUTING ||============================== //

const AuthenticationRoutes = {
  path: "/",
  element: <MinimalLayout />,
  children: [
    {
      path: "/login",
      element: <AuthLogin3 />,
    },
  ],
};

export default AuthenticationRoutes;
