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
import { useAuth } from "../../context/auth";
import { useEffect, useState } from "react";
import moment from "moment";

// styles
const CardWrapper = styled(MainCard)(({ theme }) => ({
  overflow: "hidden",
  position: "relative",
}));

// ==============================|| DASHBOARD - TOTAL INCOME LIGHT CARD ||============================== //

const Batches = ({ programName, programImg }) => {
  const theme = useTheme();
  const { userData } = useAuth();

  const [batchData, setBatchData] = useState([]);
  const getBactchData = async () => {
    try {
      const response = await fetch(
        `${
          import.meta.env.VITE_PUBLIC_URL
        }/api/batches/listByCompany?access_token=${userData?.accessToken}`
      );
      const result = await response.json();
      console.log("result", result);
      if (result?.code === 200) {
        setBatchData(result?.data?.batches);
      }
    } catch (error) {
      console.log(error);
    }
  };
  console.log(batchData);
  useEffect(() => {
    getBactchData();
  }, []);

  return (
    <>
      <Card>
        <Box>
          <List>
            {batchData &&
              batchData?.map((data, item) => {
                if (item < 3) {
                  return (
                    <>
                      <Box className="flex items-center  space-x-4" key={item}>
                        <img
                          className="w-18 h-10 mr-2"
                          src={programImg}
                          alt=""
                        />
                        <ListItemText className="flex-1 min-w-0">
                          <Typography
                            variant="subtitle1"
                            className="text-md font-medium text-gray-900"
                            noWrap
                          >
                            {data?.name}
                          </Typography>
                          <Typography
                            variant="body2"
                            className="text-md text-gray-500 capitalize"
                            noWrap
                          >
                            {moment(data?.createdAt).fromNow()}
                          </Typography>
                        </ListItemText>
                        <Box
                          className="inline-flex items-center text-green-500"
                          fontSize={16}
                        >
                          <Link
                            href={`/batch/${data?.batchId}`}
                            color="inherit"
                            underline="none"
                          >
                            View
                          </Link>
                        </Box>
                      </Box>
                      {item < 2 && <Divider sx={{ my: 1.5 }} />}
                    </>
                  );
                }
              })}
            {batchData && batchData?.length === 0 && <Box>No Batches</Box>}
          </List>
        </Box>
      </Card>
    </>
  );
};

Batches.propTypes = {
  isLoading: PropTypes.bool,
};
export default Batches;
