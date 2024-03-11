import { lazy } from 'react';

// project imports
import Loadable from '../components/ui-component/Loadable';
import MinimalLayout from '../layout/MainLayout';

const RoRmReports = Loadable(lazy(() => import('../pages/Reports/RoRmReports')));
const AttendanceReport = Loadable(lazy(() => import('../pages/Reports/AttendanceReport')));
const KotakBoRoRmReports = Loadable(lazy(() => import('../pages/Reports/KotakBoRoRmReports')));
const AuditReport = Loadable(lazy(() => import('../pages/Reports/AuditReport')));
const TrainerWiseReport = Loadable(lazy(() => import('../pages/Reports/TrainerWiseReport')));
const ParticipantsBasedReport = Loadable(lazy(() => import('../pages/Reports/ParticipantsBasedReport')));
const ParticipantsPerformanceData = Loadable(lazy(() => import('../pages/Reports/PerformanceDataReport ')));
const ReportFormate = Loadable(lazy(() => import('../pages/Reports/ReportFormat')));
const SummaryReport = Loadable(lazy(() => import('../pages/Reports/SummaryReport')));
const ConsolidatedReport = Loadable(lazy(() => import('../pages/Reports/ConsolidatedReport')));
const Assessmenteports = Loadable(lazy(() => import('../pages/Reports/Assessmenteports')));
const TopscoreReports = Loadable(lazy(() => import('../pages/Reports/TopscoreReports')));
const MonthlyAttendanceReports = Loadable(lazy(() => import('../pages/Reports/MonthlyAttendanceReports')));
const Monthlydeckreport = Loadable(lazy(() => import('../pages/Reports/Monthlydeckreport')));



// ==============================|| TRAINING ROUTING ||============================== //

const ReportsRoutes = {
    path: '/',
    element: <MinimalLayout />,
    children: [
        {
            path: '/reports/ro-rm-reports',
            element: <RoRmReports />,
        },
        {
            path: '/reports/attendance-report',
            element: <AttendanceReport />,
        },
        {
            path: '/reports/kotak-bo-ro-rm-reports',
            element: <KotakBoRoRmReports />,
        },
        {
            path: '/reports/trainer-wise-report',
            element: <TrainerWiseReport />,
        },
        {
            path: '/reports/participants-based-report',
            element: <ParticipantsBasedReport />,
        },
        {
            path: '/reports/participants-performance-data',
            element: <ParticipantsPerformanceData />,
        },

        {
            path: '/reports/trainer-level',
            element: <ReportFormate />,
        },
        {
            path: '/reports/summary-report',
            element: <SummaryReport />,
        },
        {
            path: '/reports/consolidated-report',
            element: <ConsolidatedReport />,
        },
        {
            path: '/reports/assessment-report',
            element: <Assessmenteports />,
        },
        {
            path: '/reports/topscorer-report',
            element: <TopscoreReports />,
        },
        {
            path: '/reports/monthlyattendance-report',
            element: <MonthlyAttendanceReports />,
        },
        {
            path: '/reports/monthlydeck-report',
            element: <Monthlydeckreport />
        },
        {
            path: '/reports/audit-report',
            element: <AuditReport />,
        },
    ],
};

export default ReportsRoutes;
