import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import moment from "moment";
import { useAuth } from "../../../../context/auth";
//../../context/auth
// material-ui
import { useTheme } from "@mui/material/styles";
import {
  Avatar,
  Box,
  Button,
  ButtonBase,
  CardActions,
  Chip,
  ClickAwayListener,
  Divider,
  Grid,
  Paper,
  Popper,
  Stack,
  TextField,
  Typography,
  useMediaQuery,
} from "@mui/material";

// third-party
import PerfectScrollbar from "react-perfect-scrollbar";

// project imports
import MainCard from "../../../../components/ui-component/cards/MainCard";
import Transitions from "../../../../components/ui-component/extended/Transitions";
import NotificationList from "./NotificationList";

// assets
import { CiBellOn } from "react-icons/ci";
// import { CiBellOn } from '@tabler/icons';

// ==============================|| NOTIFICATION ||============================== //

const NotificationSection = () => {
  const theme = useTheme();
  const matchesXs = useMediaQuery(theme.breakpoints.down("md"));
  const { userData, signOut } = useAuth();
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const [currentDate, setCurrentDate] = useState("");
  const [tenativeKey, setTenativekey] = useState("");
  /**
   * anchorRef is used on different componets and specifying one type leads to other components throwing an error
   * */
  const anchorRef = useRef(null);

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }
    setOpen(false);
  };

  const prevOpen = useRef(open);
  useEffect(() => {
    if (prevOpen.current === true && open === false) {
      anchorRef.current.focus();
    }
    prevOpen.current = open;
  }, [open]);

  const handleChange = (event) => {
    if (event?.target.value) setValue(event?.target.value);
  };

  useEffect(() => {
    getProgramByMonths();
  }, []);

  const getProgramByMonths = () => {
    const date = currentDate ? currentDate : moment().format("YYYY-MM-DD");
    fetch(
      `${
        import.meta.env.VITE_PUBLIC_URL
      }/api/programs/getProgramByMonth?date=${date}&access_token=${
        userData?.accessToken
      }`
    )
      .then(async (response) => {
        const data = await response.json();
        if (!response.ok) {
          const error = (data && data.message) || response.statusText;
          return Promise.reject(error);
        }
        setTenativekey(data?.data[0]?.tenantKey);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const bankIconArray = [
    {
      name: "kotak",
      id: "10d08176f2e74175ba526ab1b23beecc",
      logoName: "/kotak.png",
      logoIcon: "/wagon-login.png",
    },
    {
      name: "axis",
      id: "ac7153df458aefc2a93fd1a4f7513147",
      logoName: "/axisLogo-1.png",
      logoIcon: "/wagon-login.png",
    },
    {
      name: "idfc",
      id: "uq15v1axohhui5ytm2mxhdzcuywuakj7",
      logoName: "/IDFC-logo-website.jpg",
      logoIcon: "/wagon-login.png",
    },
  ];

  return (
    <>
      {bankIconArray.map(
        (logo, index) =>
          logo.id === tenativeKey && (
            <>
              <img
                key={index}
                src={`${logo.logoName}`}
                className="sm:mx-0 mx-auto"
                style={{ height: "2.5rem" }}
                alt={`${logo.name} Logo`}
              />
            </>
          )
      )}
      <Box
        sx={{
          ml: 2,
          mr: 3,
          [theme.breakpoints.down("md")]: {
            mr: 2,
          },
        }}
      >
        <ButtonBase sx={{ borderRadius: "12px" }}>
          <Avatar
            variant="rounded"
            sx={{
              ...theme.typography.commonAvatar,
              ...theme.typography.mediumAvatar,
              transition: "all .2s ease-in-out",
              background: theme.palette.secondary.light,
              color: theme.palette.secondary.dark,
            }}
            ref={anchorRef}
            aria-controls={open ? "menu-list-grow" : undefined}
            aria-haspopup="true"
            onClick={handleToggle}
            color="inherit"
          >
            <CiBellOn stroke={1.5} size="1.3rem" />
          </Avatar>
        </ButtonBase>

        {/* </div> */}
      </Box>

      {/* <Popper
        placement={matchesXs ? 'bottom' : 'bottom-end'}
        open={open}
        anchorEl={anchorRef.current}
        role={undefined}
        transition
        disablePortal
        popperOptions={{
          modifiers: [
            {
              name: 'offset',
              options: {
                offset: [matchesXs ? 5 : 0, 20]
              }
            }
          ]
        }}
      >
        {({ TransitionProps }) => (
          <Transitions position={matchesXs ? 'top' : 'top-right'} in={open} {...TransitionProps}>
            <Paper>
              <ClickAwayListener onClickAway={handleClose}>
                <MainCard border={false} elevation={16} content={false} boxShadow shadow={theme.shadows[16]}>
                  <Grid container direction="column" spacing={2}>
                    <Grid item xs={12}>
                      <Grid container alignItems="center" justifyContent="space-between" sx={{ pt: 2, px: 2 }}>
                        <Grid item>
                          <Stack direction="row" spacing={2}>
                            <Typography variant="subtitle1">All Notification</Typography>
                            <Chip
                              size="small"
                              label="01"
                              sx={{
                                color: theme.palette.background.default,
                                bgcolor: theme.palette.warning.dark
                              }}
                            />
                          </Stack>
                        </Grid>
                        <Grid item>
                          <Typography component={Link} to="#" variant="subtitle2" color="primary">
                            Mark as all read
                          </Typography>
                        </Grid>
                      </Grid>
                    </Grid>
                    <Grid item xs={12}>
                      <PerfectScrollbar style={{ height: '100%', maxHeight: 'calc(100vh - 205px)', overflowX: 'hidden' }}>
                        <Grid container direction="column" spacing={2}>
                          <Grid item xs={12}>
                            <Box sx={{ px: 2, pt: 0.25 }}>
                              <TextField
                                id="outlined-select-currency-native"
                                select
                                fullWidth
                                value={value}
                                onChange={handleChange}
                                SelectProps={{
                                  native: true
                                }}
                              >
                                {status.map((option) => (
                                  <option key={option.value} value={option.value}>
                                    {option.label}
                                  </option>
                                ))}
                              </TextField>
                            </Box>
                          </Grid>
                          <Grid item xs={12} p={0}>
                            <Divider sx={{ my: 0 }} />
                          </Grid>
                        </Grid>
                        <NotificationList />
                      </PerfectScrollbar>
                    </Grid>
                  </Grid>
                  <Divider />
                  <CardActions sx={{ p: 1.25, justifyContent: 'center' }}>
                    <Button size="small" disableElevation>
                      View All
                    </Button>
                  </CardActions>
                </MainCard>
              </ClickAwayListener>
            </Paper>
          </Transitions>
        )}
      </Popper> */}
    </>
  );
};

export default NotificationSection;
