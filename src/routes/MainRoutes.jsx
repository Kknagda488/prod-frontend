import { lazy } from "react";

// project imports
import MainLayout from "../layout/MainLayout";
import Loadable from "../components/ui-component/Loadable";
import Protected from "../components/auth/components/Protected";

// dashboard routing
const DashboardDefault = Loadable(
  lazy(() => import("../components/dashboard"))
);

// ==============================|| MAIN ROUTING ||============================== //

const MainRoutes = {
  path: "/",
  element: <MainLayout />,
  children: [
    {
      path: "/",
      element: (
        <Protected>
          <DashboardDefault />
        </Protected>
      ),
    },
    {
      path: "dashboard",
      element: (
        <Protected>
          <DashboardDefault />
        </Protected>
      ),
    },
    // {
    //   path: 'sample-page',
    //   element: <SamplePage />
    // }
  ],
};

export default MainRoutes;
