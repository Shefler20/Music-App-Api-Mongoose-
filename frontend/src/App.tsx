import { Container} from "@mui/material";
import { Route, Routes} from "react-router-dom";
import Home from "./containers/Home/Home.tsx";
import PageNotFound from "./containers/PageNotFound/PageNotFound.tsx";
import ArtistAlbums from "./containers/ArtistAlbums/ArtistAlbums.tsx";
import TracksInAlbum from "./containers/TracksInAlbum/TracksInAlbum.tsx";
import Register from "./containers/Register/Register.tsx";
import Header from "./components/Header/Header.tsx";
import Login from "./containers/Login/Login.tsx";



const App = () => (
    <>
        <Header />
        <Container maxWidth="lg">
            <Routes>
                <Route path="/" element={<Home/>} />
                <Route path="/register" element={<Register/>}/>
                <Route path="/login" element={<Login/>}/>
                <Route path="/albums" element={<ArtistAlbums/>}/>
                <Route path="/tracks" element={<TracksInAlbum/>}/>

                <Route path="*" element={<PageNotFound/>}/>
            </Routes>
        </Container>
    </>
);

export default App
