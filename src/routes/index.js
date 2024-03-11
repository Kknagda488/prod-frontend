import { useRoutes } from 'react-router-dom';

// routes
import MainRoutes from './MainRoutes.jsx';
import AuthenticationRoutes from './AuthenticationRoutes.jsx';
import TrainingRoutes from './TrainingRoutes.jsx';
import ReportsRoutes from './ReportsRoutes.jsx';
import NomineeFormRoutes from './NomineFormRoutes.jsx'
import ProgramListRoutes from './ProgramListRoute.jsx'
// ==============================|| ROUTING RENDER ||============================== //

export default function ThemeRoutes() {
    return useRoutes([MainRoutes, AuthenticationRoutes, TrainingRoutes, ReportsRoutes, ProgramListRoutes, NomineeFormRoutes]);
}
