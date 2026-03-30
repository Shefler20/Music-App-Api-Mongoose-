import {AppBar, Box, Button, Container, Toolbar, Typography} from "@mui/material";
import {NavLink} from "react-router-dom";

const Header= () => {
    return (
        <div>
            <AppBar position="static" sx={{ backgroundColor: "grey.700" }}>
                <Container maxWidth="xl">
                    <Toolbar sx={{px:0}}>
                        <Typography variant="h4" sx={{ flexGrow: 1 }}>
                            <NavLink
                                to='/'
                                style={{ textDecoration: 'none', color: 'inherit' }}
                            >Music App</NavLink>
                        </Typography>
                        <Box sx={{ display: "flex", gap: 2 }}>
                            <Button
                                color="inherit"
                                component={NavLink}
                                to="/register"
                            >
                                Sign Up
                            </Button>

                            <Button
                                variant="outlined"
                                color="inherit"
                                component={NavLink}
                                to="/login"
                            >
                                Sign In
                            </Button>
                        </Box>
                    </Toolbar>
                </Container>
            </AppBar>
        </div>
    );
};

export default Header;