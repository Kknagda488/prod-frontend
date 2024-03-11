// material-ui
import { useTheme, styled } from "@mui/material/styles";
import {
  Avatar,
  Box,
  Card,
  Link,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Typography,
} from "@mui/material";

// project imports

// types
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";

// styles

// ==============================|| DASHBOARD - TOTAL INCOME LIGHT CARD ||============================== //

const NewProgramCom = ({ programName, programImg, bgcolor, url }) => {
  const theme = useTheme();
  const navigate = useNavigate();

  const navigateToCreatePrgram = () => {
    navigate(url);
  };

  return (
    <>
      <Card sx={{ bgcolor: bgcolor }} onClick={navigateToCreatePrgram}>
        <Box sx={{ px: 1 }}>
          <List sx={{ py: 0 }}>
            <ListItem alignItems="center" disableGutters sx={{ py: 0 }}>
              <img className="w-12 h-auto mr-2" src={programImg} alt="" />
              <ListItemText
                sx={{
                  py: 0,
                  mt: 0.45,
                  mb: 0.45,
                }}
                primary={
                  <Typography
                    color={theme.palette.secondary.contrastText}
                    sx={{ fontSize: "14px", fontWeight: "600" }}
                  >
                    {programName}
                  </Typography>
                }
              />
            </ListItem>
          </List>
        </Box>
      </Card>
    </>
  );
};

NewProgramCom.propTypes = {
  isLoading: PropTypes.bool,
};

export default NewProgramCom;
