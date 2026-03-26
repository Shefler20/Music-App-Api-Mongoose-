import {Container} from "@mui/material";
import {Route, Routes} from "react-router-dom";
import Home from "./containers/Home/Home.tsx";
import PageNotFound from "./containers/PageNotFound/PageNotFound.tsx";
import ArtistAlbums from "./containers/ArtistAlbums/ArtistAlbums.tsx";



const App = () => (
    <>
        <Container maxWidth="lg">
            <Routes>
                <Route path="/" element={<Home/>} />
                <Route path="/albums" element={<ArtistAlbums/>}/>

                <Route path="*" element={<PageNotFound/>}/>
            </Routes>
        </Container>
    </>
);

export default App
