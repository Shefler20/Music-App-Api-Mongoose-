import type {PropsWithChildren} from "react";
import {Navigate} from "react-router-dom";
import {useAppSelector} from "../../app/hooks.ts";
import {userSelector} from "../../features/users/usersSelectors.ts";


const PrivateRoute: React.FC<PropsWithChildren> = ({children}) => {
    const user = useAppSelector(userSelector);
    if (!user) {
        return <Navigate to="/login" replace />;
    }

    return <>{children}</>;
};

export default PrivateRoute;