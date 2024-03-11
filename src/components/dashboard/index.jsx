import { useEffect, useState } from "react";
import {
  Grid,
  Button,
  CardContent,
  Typography,
  Box,
  Divider,
} from "@mui/material";
import moment from "moment";
import { gridSpacing } from "../ui-component/store/constant";
import { useAuth } from "../../context/auth";
import certificate from "../../assets/img/users/certificate.png";
import people from "../../assets/img/users/people.png";
import activeuser from "../../assets/img/users/activeuser.png";
import QuickAction from "./quickActions";
import NewProgramCom from "./NewProgramCom";
import MainCard from "../ui-component/cards/MainCard";
import Batches from "./Batches";
import Programs from "./Programs";
// import { Box } from "@mui/system";
import "react-day-picker/dist/style.css";
import "../dashboard/calender.css";
import TotalProgramCounterAndName from "./TotalProgramCounterAndName";
import Calendar from "./Calendar";

const Dashboard = () => {
  const [cardData, setCardData] = useState({
    totalPrograms: "0",
    totalBatches: "0",
    totalRegistrations: "0",
  });
  const { userData, signOut } = useAuth();
  console.log("==========user data=====", userData);
  const [currentDate, setCurrentDate] = useState("");

  const [programData, setProgramData] = useState([]);
  console.log(programData, setCurrentDate, cardData);
  const [selected, setSelected] = useState(Date);
  const [tenativeKey, setTenativekey] = useState("");

  const getCardData = () => {
    fetch(
      `${import.meta.env.VITE_PUBLIC_URL}/api/programs/getStats?access_token=${
        userData?.accessToken
      }`
    )
      .then(async (response) => {
        const data = await response.json();

        // check for error response
        if (!response.ok) {
          // get error message from body or default to response statusText
          const error = (data && data.message) || response.statusText;
          return Promise.reject(error);
        }
        console.log(data.data);
        setCardData(data?.data);
      })
      .catch((error) => {
        setCardData([]);
        console.error("There was an error!", error);
        if (error === "Token Expired") {
        }
      });
  };

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
        console.log("Program by Month: ", data.data);
        setProgramData(data.data);
        setTenativekey(data?.data[0]?.tenantKey);
      })
      .catch((error) => {
        setProgramData([]);
        console.error("There was an error!", error);
        if (error === "Token Expired") {
          // signOut();
        }
      });
  };
  useEffect(() => {
    getCardData();
    getProgramByMonths();
  }, []);
  const [isLoading, setLoading] = useState(true);
  useEffect(() => {
    setLoading(false);
  }, []);

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Grid container spacing={2}>
          <Grid item lg={4} md={6} sm={6} xs={12}>
            <TotalProgramCounterAndName
              programName="Total Programs"
              programCount={cardData?.totalPrograms}
              programImg={certificate}
            />
          </Grid>
          <Grid item lg={4} md={6} sm={6} xs={12}>
            <TotalProgramCounterAndName
              programName="Total Batches"
              programCount={cardData?.totalBatches}
              programImg={people}
            />
          </Grid>
          <Grid item lg={4} md={6} sm={6} xs={12}>
            <TotalProgramCounterAndName
              programName="Total Registrations"
              programCount={cardData?.totalRegistrations}
              programImg={activeuser}
            />
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={12}>
        <Grid container spacing={2}>
          <Grid item xs={14} md={4.5}>
            <MainCard
              content={false}
              style={{ boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)" }}
              className="rounded-md bg-white"
            >
              {/* <CardContent> */}
              {/* <Box
                  display="flex"
                  alignItems="start"
                  justifyContent="space-between"
                  marginTop={1}
                >
                  <Box
                    marginTop={"-20px"}
                    className="calender"
                    borderRight={"1px solid #e3e8ef"}
                  >
                    <DayPicker selected={selected} onSelect={ } style={{ fontSize: "14px" }} />
                  </Box>
                  <Box pl={2}>
                    <Typography
                      fontSize="16px"
                      fontWeight="600"
                      color="#374751"
                    >
                      Schedule for {moment(selected).format("MMM Do YY")}
                    </Typography>
                    <Typography
                      fontSize="14px"
                      fontWeight="400"
                      color="#374751"
                      noWrap
                    >
                      No programs.
                    </Typography>
                  </Box> 
                </Box>
                  */}
              <Calendar />
              {/* </CardContent> */}
            </MainCard>
          </Grid>
          <Grid item xs={12} md={2.5}>
            <MainCard
              content={false}
              style={{ boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)" }}
              className="rounded-md bg-white"
            >
              <CardContent>
                <Grid container spacing={gridSpacing}>
                  <Grid item xs={12}>
                    <Grid
                      container
                      alignContent="center"
                      justifyContent="flex-start"
                    >
                      <Grid item marginBottom={2}>
                        <Typography fontSize="18px" fontWeight="600">
                          Programs
                        </Typography>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid container spacing={gridSpacing}>
                  <Grid item sm={6} xs={12} md={6} lg={12}>
                    <Programs />
                  </Grid>
                </Grid>
              </CardContent>
            </MainCard>
          </Grid>
          <Grid item xs={12} md={2.5}>
            <MainCard
              content={false}
              style={{ boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)" }}
              className="rounded-md bg-white"
            >
              <CardContent>
                <Box>
                  <Grid container spacing={gridSpacing}>
                    <Grid item xs={12}>
                      <Grid
                        container
                        alignContent="center"
                        justifyContent="flex-start"
                      >
                        <Grid item marginBottom={2}>
                          <Typography fontSize="18px" fontWeight="600">
                            Batches
                          </Typography>
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid container spacing={gridSpacing}>
                    <Grid item sm={6} xs={12} md={6} lg={12}>
                      <Batches
                        programName="Create New Program"
                        programImg={people}
                      />
                    </Grid>
                  </Grid>
                </Box>
              </CardContent>
            </MainCard>
          </Grid>
          <Grid item xs={12} md={2.5}>
            <MainCard
              content={false}
              style={{ boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)" }}
              className="rounded-md bg-white"
            >
              <CardContent>
                <Grid container spacing={gridSpacing}>
                  <Grid item xs={12}>
                    <Grid
                      container
                      alignContent="center"
                      justifyContent="flex-start"
                    >
                      <Grid item marginBottom={2}>
                        <Typography fontSize="18px" fontWeight="600">
                          Popular Stocks
                        </Typography>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid container spacing={2}>
                  <Grid item sm={6} xs={12} md={6} lg={12}>
                    <NewProgramCom
                      programName="Create New Program"
                      programImg={certificate}
                      bgcolor="#38BDF8"
                      url="/program/create-program"
                    />
                  </Grid>
                  <Grid item sm={6} xs={12} md={6} lg={12}>
                    <QuickAction
                      programName="View All Programs"
                      programImg={people}
                      bgcolor="#FDBA74"
                      url={`/program/program-list/${tenativeKey}`}
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </MainCard>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default Dashboard;
