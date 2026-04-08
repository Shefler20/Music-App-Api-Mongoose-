import {Button, Menu, MenuItem} from "@mui/material";
import {useState} from "react";
import {useAppDispatch} from "../../../app/hooks.ts";
import {logout} from "../../../features/users/usersSlice.ts";
import {NavLink} from "react-router-dom";

interface Props {
    user: User;
}

const UserMenu: React.FC<Props> = ({user}) => {
    const dispatch = useAppDispatch();
    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

    const handleClick = (e: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(e.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = () => {
        dispatch(logout());
    };
    return (
        <>
            <Button
                variant="outlined"
                onClick={handleClick}
                color="inherit"
            >
                Hello {user.username}!
            </Button>
            <Menu
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={handleClose}
            >
                <MenuItem onClick={handleLogout}>Logout</MenuItem>
                <MenuItem component={NavLink} to={"/trach_history"}>Track History</MenuItem>
            </Menu>
        </>
    );
};

export default UserMenu;