import {Button, Menu, MenuItem} from "@mui/material";
import {useState} from "react";

interface Props {
    user: User;
}

const UserMenu: React.FC<Props> = ({user}) => {
    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

    const handleClick = (e: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(e.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
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
                <MenuItem>Logout</MenuItem>
            </Menu>
        </>
    );
};

export default UserMenu;