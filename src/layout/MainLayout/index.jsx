import { useDispatch, useSelector } from 'react-redux';
import { Outlet } from 'react-router-dom';

// material-ui
import { styled, useTheme } from '@mui/material/styles';
import { AppBar, Box, CssBaseline, Toolbar, useMediaQuery } from '@mui/material';

// project imports
import Header from './Header';
import Sidebar from './Sidebar';
import Customization from '../Customization';
import navigation from '../../menu-items';
import { drawerWidth } from '../../components/ui-component/store/constant';
import { SET_MENU } from '../../components/ui-component/store/actions';

// assets
import { FaChevronRight } from "react-icons/fa";
// import { FaChevronRight } from '@tabler/icons';
import Breadcrumbs from '../../components/ui-component/extended/Breadcrumbs';
import { useAuth } from '../../context/auth';
import { useEffect } from 'react';

// styles
const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })(({ theme, open }) => ({
  ...theme.typography.mainContent,
  borderBottomLeftRadius: 0,
  borderBottomRightRadius: 0,
  transition: theme.transitions.create(
    'margin',
    open
      ? {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen
      }
      : {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen
      }
  ),
  [theme.breakpoints.up('md')]: {
    marginLeft: open ? 0 : -(drawerWidth - 20),
    width: `calc(100% - ${drawerWidth}px)`
  },
  [theme.breakpoints.down('md')]: {
    marginLeft: '20px',
    width: `calc(100% - ${drawerWidth}px)`,
    padding: '16px'
  },
  [theme.breakpoints.down('sm')]: {
    marginLeft: '10px',
    width: `calc(100% - ${drawerWidth}px)`,
    padding: '16px',
    marginRight: '10px'
  }
}));

// ==============================|| MAIN LAYOUT ||============================== //

const MainLayout = () => {
  const theme = useTheme();
  const { userData } = useAuth();
  const matchDownMd = useMediaQuery(theme.breakpoints.down('md'));
  // Handle left drawer
  const leftDrawerOpened = useSelector((state) => state.customization.opened);
  const dispatch = useDispatch();
  const handleLeftDrawerToggle = () => {
    dispatch({ type: SET_MENU, opened: !leftDrawerOpened });
  };

  let modifiedNavigation = { ...navigation };

  useEffect(() => {
    const newItems = [];

    if (userData?.client === "axis") {
      newItems.push(
        {
          id: 'assessmentreport',
          title: 'Assessment report',
          type: 'item',
          url: 'reports/assessment-report',
          target: false
        },
        {
          id: 'topscorerreport',
          title: 'Top Scorer report',
          type: 'item',
          url: 'reports/topscorer-report',
          target: false
        },
        {
          id: 'monthlyattendancereport',
          title: 'Monthly Attendance Report',
          type: 'item',
          url: 'reports/monthlyattendance-report',
          target: false
        },
        {
          id: 'monthlydeckreport',
          title: 'Monthly Deck Report',
          type: 'item',
          url: 'reports/monthlydeck-report',
          target: false
        },
        {
          id: 'auditreport',
          title: 'Audit Report',
          type: 'item',
          url: 'reports/audit-report',
          target: false
        }
      );
    } else if (userData?.client === "kotak") {
      newItems.push(
        {
          id: 'rormreports',
          title: 'RO/RM Reports',
          type: 'item',
          url: 'reports/ro-rm-reports',
          target: false
        },
        {
          id: 'summaryreport',
          title: 'Summary Report',
          type: 'item',
          url: 'reports/summary-report',
          target: false
        }
      );
    }

    if (newItems.length > 0) {
      const existingItems = modifiedNavigation.items[2].children[0].children;
      const updatedItems = existingItems.filter(item => !newItems.some(newItem => newItem.id === item.id));
      modifiedNavigation.items[2].children[0].children = updatedItems.concat(newItems);
    }
  }, [userData?.client]);


  // useEffect(() => {
  //   if (userData?.client === "axis") {
  //     modifiedNavigation.items[2].children[0].children.push(
  //       {
  //         id: 'assessmentreport',
  //         title: 'Assessment report',
  //         type: 'item', 
  //         url: 'reports/assessment-report',
  //         target: false
  //       },
  //       {
  //         id: 'topscorerreport',
  //         title: 'Top Scorer report',
  //         type: 'item',
  //         url: 'reports/topscorer-report',
  //         target: false
  //       },
  //       {
  //         id: 'monthlyattendancereport',
  //         title: 'Monthly Attendance Report',
  //         type: 'item',
  //         url: 'reports/monthlyattendance-report',
  //         target: false
  //       },
  //       {
  //         id: 'monthlydeckreport',
  //         title: 'Monthly Deck Report',
  //         type: 'item',
  //         url: 'reports/monthlydeck-report',
  //         target: false
  //       },
  //       {
  //         id: 'auditreport',
  //         title: 'Audit Report',
  //         type: 'item',
  //         url: 'reports/audit-report',
  //         target: false
  //       }
  //     );
  //   } else if (userData?.client === "kotak") {
  //     modifiedNavigation.items[2].children[0].children.push(
  //       {
  //         id: 'rormreports',
  //         title: 'RO/RM Reports',
  //         type: 'item',
  //         url: 'reports/ro-rm-reports',
  //         target: false
  //       },
  //       {
  //         id: 'summaryreport',
  //         title: 'Summary Report',
  //         type: 'item',
  //         url: 'reports/summary-report',
  //         target: false
  //       }
  //     );
  //   }
  // }, [])

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      {/* header */}
      <AppBar
        enableColorOnDark
        position="fixed"
        color="inherit"
        elevation={0}
        sx={{
          bgcolor: theme.palette.background.default,
          transition: leftDrawerOpened ? theme.transitions.create('width') : 'none'
        }}
      >
        <Toolbar>
          <Header handleLeftDrawerToggle={handleLeftDrawerToggle} />
        </Toolbar>
      </AppBar>

      {/* drawer */}
      <Sidebar drawerOpen={!matchDownMd ? leftDrawerOpened : !leftDrawerOpened} drawerToggle={handleLeftDrawerToggle} />

      {/* main content */}
      <Main theme={theme} open={leftDrawerOpened}>
        {/* breadcrumb */}
        <Breadcrumbs separator={FaChevronRight} navigation={modifiedNavigation} icon title rightAlign />
        <Outlet />
      </Main>
      {/* <Customization /> */}
    </Box>
  );
};

export default MainLayout;
