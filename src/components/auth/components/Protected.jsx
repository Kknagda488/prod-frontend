
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../../context/auth';


const Protected = ({ children }) => {
    //   const user = useSelector(selectLoggedInUser);
    const { userData } = useAuth();
    if (!userData) {
        return <Navigate to="/login" replace={true}></Navigate>;
    }
    return children;
}

export default Protected;