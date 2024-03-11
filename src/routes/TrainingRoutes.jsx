import { lazy } from 'react';

// project imports
import Loadable from '../components/ui-component/Loadable';

import MainLayout from '../layout/MainLayout';
// login option 3 routing
const AllProgram = Loadable(lazy(() => import('../pages/training/program/AllProgramPage')));
const Program = Loadable(lazy(() => import('../pages/training/program/ProgramPage')));
const CreateProgram = Loadable(lazy(() => import('../pages/training/program/CreateProgram')));
const SaveTemplate = Loadable(lazy(() => import('../pages/training/program/Savetemplate')))
const Certificates = Loadable(lazy(() => import('../pages/training/Certificates')));
const UpdateProgram = Loadable(lazy(() => import('../pages/training/program/UpdateProgram')));
const UpdateAssessment = Loadable(lazy(() => import('../pages/training/UpdateQuestionBank')));
const Batch = Loadable(lazy(() => import('../pages/Batch')));
const BatchReport = Loadable(lazy(() => import('../pages/training/program/BatchReport')))
const QuestionBank = Loadable(lazy(() => import('../pages/training/QuestionBank')))

// ==============================|| TRAINING ROUTING ||============================== //

const TrainingRoutes = {
    path: '/',
    element: <MainLayout />,
    children: [
        {
            path: '/program',
            element: <AllProgram />,
        },
        {
            path: 'program/:programId',
            element: <Program />,
        },
        {
            path: 'program/create-program',
            element: <CreateProgram />,
        },
        {
            path: 'program/UpdateProgram/:id',
            element: <UpdateProgram />,
        },
        {
            path: 'certificate',
            element: <Certificates />,
        },
        {
            path: 'batch/:batchId',
            element: <Batch />,
        },
        {
            path: 'questionbanks',
            element: <QuestionBank />
        },
        {
            path: '/batch/report/:batchId',
            element: <BatchReport />
        }, {
            path: 'savetemplate/:batchId/:name/:asstype/:assessmentId',
            element: <SaveTemplate />
        }, {
            path: 'update-assessment/:assessmentId',
            element: <UpdateAssessment />
        }

    ],
};

export default TrainingRoutes;
