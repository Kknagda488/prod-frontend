// material-ui
import { useTheme, styled } from "@mui/material/styles";
import {
  Avatar,
  Box,
  Card,
  Divider,
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
import MainCard from "../ui-component/cards/MainCard";
import { useEffect, useState } from "react";
import { useAuth } from "../../context/auth";
import moment from "moment";

// styles
const CardWrapper = styled(MainCard)(({ theme }) => ({
  overflow: "hidden",
  position: "relative",
}));

// ==============================|| DASHBOARD - TOTAL INCOME LIGHT CARD ||============================== //

const Programs = () => {
  const { userData } = useAuth();
  const [programGrp, setProgramGrp] = useState([]);
  const [programList, setProgramList] = useState([]);

  const fetchProgramList = async () => {
    try {
      const filter = {
        pageLimit: 10,
        pageNo: 1,
        search: "",
      };
      const params = encodeURIComponent(JSON.stringify(filter));
      const response = await fetch(
        `${
          import.meta.env.VITE_PUBLIC_URL
        }/api/programs/list?filter=${params}&access_token=${
          userData?.accessToken
        }`
      );
      const data = await response.json();
      setProgramList(data.data.programs);
      // setPgindex(data.data.lastPage);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    fetchProgramList();
  }, []);

  const theme = useTheme();
  return (
    <>
      <Card>
        <Box>
          <List>
            {programList &&
              programList?.map((data, item) => {
                if (item < 3) {
                  return (
                    <>
                      <Box id={data?.id}>
                        <Box className="flex items-center space-x-2">
                          <ListItemText className="flex-1 min-w-0">
                            <Typography
                              className="text-md font-medium text-gray-900"
                              noWrap
                              style={{ color: "#FB8916" }}
                            >
                              {(data?.clientName).substring(0, 15) + "..."}
                            </Typography>
                            <Typography
                              className="text-md text-gray-500 capitalize"
                              noWrap
                            >
                              {moment(data?.createdAt).fromNow("minutes")} ago
                            </Typography>
                          </ListItemText>
                          <Box
                            className="inline-flex items-center text-green-500"
                            fontSize={16}
                          >
                            <Link
                              href="/program"
                              color="inherit"
                              underline="none"
                            >
                              View
                            </Link>
                          </Box>
                        </Box>
                        {item < 2 && <Divider sx={{ my: 1.5 }} />}
                      </Box>
                    </>
                  );
                }
              })}
            {programList && programList?.length === 0 && <Box>No Programs</Box>}
          </List>
        </Box>
      </Card>
    </>
  );
};

Programs.propTypes = {
  isLoading: PropTypes.bool,
};
export default Programs;
