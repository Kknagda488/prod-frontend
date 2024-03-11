// assets
import { AiOutlineDashboard } from "react-icons/ai";

// constant
// const icons = { IconDashboard };

// ==============================|| DASHBOARD MENU ITEMS ||============================== //

const dashboard = {
  id: 'dashboard',
  //title: 'Dashboard',
  type: 'group',
  children: [
    {
      id: 'default',
      title: 'Dashboard',
      type: 'item',
      url: 'dashboard',
      icon: AiOutlineDashboard,
      breadcrumbs: false
    }
  ]
};

export default dashboard;
