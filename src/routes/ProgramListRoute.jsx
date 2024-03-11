import { lazy } from 'react';

// project imports
import Loadable from '../components/ui-component/Loadable';

const ProgramList = Loadable(lazy(() => import('../pages/training/program/Program-list/ProgramList')))
const AttendanceForm = Loadable(lazy(() => import('../pages/training/program/AttendenceForm')));
const LiveBatchTracking = Loadable(lazy(() => import('../pages/training/program/livebatchtracking')));
const Quiz = Loadable(lazy(() => import('../pages/training/program/QuizPage')));
// ==============================|| TRAINING ROUTING ||============================== //

const ProgramListRoutes = {
    path: '/',
    children: [
        {
            path: '/program/program-list/:tenantKey',
            element: <ProgramList />,
        },
        {
            path: '/attendance-form/:batchId',
            element: <AttendanceForm />
        }, {
            path: '/quiz/:batchid/:name/:asstype/:id',
            element: <Quiz />
        }, {
            path: '/livebatchtracking/:batchId',
            element: <LiveBatchTracking />
        }

    ]
};

export default ProgramListRoutes;
