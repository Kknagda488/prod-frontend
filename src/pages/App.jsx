import React, { lazy } from 'react'
import themes from '../themes';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline, StyledEngineProvider } from '@mui/material';
import { useSelector } from 'react-redux';
import NavigationScroll from '../layout/NavigationScroll'
import Routes from "../routes";
import { ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";


const App = () => {
  const customization = useSelector((state) => state.customization);
  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={themes(customization)}>
        <ToastContainer />
        <CssBaseline />
        <NavigationScroll>
          <Routes />
        </NavigationScroll>
      </ThemeProvider>
    </StyledEngineProvider>
  )
}

export default App