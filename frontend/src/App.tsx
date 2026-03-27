import {Button, Container} from "@mui/material";
import {NavLink, Route, Routes} from "react-router-dom";
import Home from "./containers/Home/Home.tsx";
import PageNotFound from "./containers/PageNotFound/PageNotFound.tsx";
import ArtistAlbums from "./containers/ArtistAlbums/ArtistAlbums.tsx";
import TracksInAlbum from "./containers/TracksInAlbum/TracksInAlbum.tsx";



const App = () => (
    <>
        <Container maxWidth="lg">
            <Button variant="contained" color="primary" component={NavLink} to={'/'} sx={{m:3}}>Home</Button>
            <Routes>
                <Route path="/" element={<Home/>} />
                <Route path="/albums" element={<ArtistAlbums/>}/>
                <Route path="/tracks" element={<TracksInAlbum/>}/>

                <Route path="*" element={<PageNotFound/>}/>
            </Routes>
        </Container>
    </>
);

export default App
