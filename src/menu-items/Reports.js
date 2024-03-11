// assets
import { TbReportAnalytics } from "react-icons/tb";
import { useAuth } from '../context/auth';


const icons = {
  TbReportAnalytics
};

const userData = JSON.parse(localStorage.getItem("userDetails"))

console.log("userData==============", userData);


// ==============================|| EXTRA reports MENU ITEMS ||============================== // 

const reports = {
  id: 'reports',
  //title: 'Reports',
  type: 'group',
  children: [
    {
      id: 'reports',
      title: 'Reports',
      type: 'collapse',
      icon: TbReportAnalytics,

      // eslint-disable-next-line no-sparse-arrays
      children: [
        {
          id: 'attendancereport',
          title: 'Attendance Report',
          type: 'item',
          url: 'reports/attendance-report',
          target: false
        }
        ,

        {
          id: 'consolidatedreport',
          title: 'Consolidated report',
          type: 'item',
          url: 'reports/consolidated-report',
          target: false
        },

        // {
        //   id: 'AU',
        //   title: 'VILT Reports',
        //   type: 'item',
        //   url: 'reports/vilt-reports',
        //   target: false
        // }
        ,
        // {
        //   id: 'kotakborormreports',
        //   title: 'KOTAK BO and RO RM REPORTS',
        //   type: 'item',
        //   url: 'reports/kotak-bo-ro-rm-reports', 
        //   target: false
        // }
        ,
        {
          id: 'trainerwisereport',
          title: 'Trainer-wise Report',
          type: 'item',
          url: 'reports/trainer-wise-report',
          target: false
        }
        ,
        {
          id: 'participantsbasedreport',
          title: 'Participants Based Report',
          type: 'item',
          url: 'reports/participants-based-report',
          target: false
        }
        ,
        {
          id: 'participantsperformancedata',
          title: 'Participants\' Performance Data',
          type: 'item',
          url: 'reports/participants-performance-data',
          target: false
        },
        {
          id: 'trainerLevel',
          title: 'Trainer Level',
          type: 'item',
          url: 'reports/trainer-level',
          target: false
        }


      ]
    }]
};

export default reports;
