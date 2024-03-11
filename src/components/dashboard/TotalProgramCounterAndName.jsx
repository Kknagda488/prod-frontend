import PropTypes from "prop-types";
import { styled, useTheme } from "@mui/material/styles";
import { Box, List, ListItem, ListItemText, Typography } from "@mui/material";
import MainCard from "../ui-component/cards/MainCard";

const CardWrapper = styled(MainCard)(({ theme }) => ({
  // backgroundColor: theme.palette.primary.white,
  backgroundColor: "#FFFFFF",
  color: theme.palette.primary.white,
  overflow: "hidden",
  position: "relative",
  boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",
  transition: "box-shadow 0.5s ease-in-out", // Add a transition for a smoother effect
  '&:hover': {
    boxShadow: "none", // Disable the box shadow on hover
    pointerEvents: "none", // Disable pointer events on hover
  },
}));

const TotalProgramCounterAndName = ({ programName, programCount, programImg }) => {
  const theme = useTheme();
  return (
    <>
      <CardWrapper border={false} content={false} className="rounded-md bg-white">
        <Box>
          <List sx={{ py: 0 }}>
            <ListItem alignItems="center" disableGutters sx={{ py: 0 }}>
              {/* <ListItemAvatar>
                  <Avatar
                    variant="rounded"
                    sx={{
                      ...theme.typography.commonAvatar,
                      ...theme.typography.largeAvatar,
                      backgroundColor: theme.palette.primary[800],
                      color: '#fff'
                    }}
                  >
                    <TableChartOutlinedIcon fontSize="inherit" />
                  </Avatar>
                </ListItemAvatar> */}
              <img className="w-18 h-36 mr-2" src={programImg} alt="" />
              <ListItemText
                sx={{
                  py: 0,
                  mt: 0.45,
                  mb: 0.45,
                }}
                primary={
                  <Typography
                    sx={{
                      color: "#374751",
                      mt: 0.25,
                      fontSize: "18px",
                      fontWeight: "600",
                    }}
                  >
                    {programName}
                  </Typography>
                }
                secondary={
                  <Typography
                    sx={{
                      color: "#374751",
                      fontSize: "20px",
                      fontWeight: "600",
                    }}
                  >
                    {programCount}
                  </Typography>
                }
              />
            </ListItem>
          </List>
        </Box>
      </CardWrapper>
    </>
  );
};

TotalProgramCounterAndName.propTypes = {
  isLoading: PropTypes.bool,
};

export default TotalProgramCounterAndName;
