import ChartList from "./ChartList";
import { Typography, CardContent } from '@mui/material';

// // project imports
import MainCard from '../../../ui-component/cards/MainCard';


const BatchReport = ({ chartData, excelData, batchData }) => {
    return (

        <>
            {/* <button>Back</button> */}
            <MainCard title="Batch Report">
                <Typography variant="body1" style={{ marginBottom: '50px', marginTop: '-35px' }}>
                    <ChartList chartData={chartData} excelData={excelData} batchData={batchData} />
                </Typography>
            </MainCard>


        </>
    );
};

export default BatchReport;

// material-ui
// import { Typography } from '@mui/material';

// // project imports
// import MainCard from 'ui-component/cards/MainCard';

// // ==============================|| SAMPLE PAGE ||============================== //

// const SamplePage = () => (
//   <MainCard title="Sample Card">
//     <Typography variant="body2">
//       Lorem ipsum dolor sit amen, consenter nipissing eli, sed do elusion tempos incident ut laborers et doolie magna alissa. Ut enif ad
//       minim venice, quin nostrum exercitation illampu laborings nisi ut liquid ex ea commons construal. Duos aube grue dolor in reprehended
//       in voltage veil esse colum doolie eu fujian bulla parian. Exceptive sin ocean cuspidate non president, sunk in culpa qui officiate
//       descent molls anim id est labours.
//     </Typography>
//   </MainCard>
// );

// export default SamplePage;
