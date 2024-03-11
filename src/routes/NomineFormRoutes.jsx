import { lazy } from 'react';

// project imports
import Loadable from '../components/ui-component/Loadable';

// login option 3 routing

const NomineeForm = Loadable(lazy(() => import('../pages/training/program/NomineeForm')))
// ==============================|| NOMINEE FORM ROUTING ||============================== //

const NomineeFormRoutes = {
    path: '/nominee-form/:programId',
    element: <NomineeForm />

};

export default NomineeFormRoutes;
