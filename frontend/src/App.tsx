import { Container} from "@mui/material";
import { Route, Routes} from "react-router-dom";
import Home from "./containers/Home/Home.tsx";
import PageNotFound from "./containers/PageNotFound/PageNotFound.tsx";
import ArtistAlbums from "./containers/ArtistAlbums/ArtistAlbums.tsx";
import TracksInAlbum from "./containers/TracksInAlbum/TracksInAlbum.tsx";
import Header from "./components/Header/Header.tsx";
import Login from "./containers/Login/Login.tsx";
import PrivateRoute from "./components/PrivateRoute/PrivateRoute.tsx";
import Register from "./containers/Register/Register.tsx";
import HistoryTrack from "./containers/HistoryTrack/HistoryTrack.tsx";
import NewArtist from "./containers/NewArtist/NewArtist.tsx";
import NewAlbum from "./containers/NewAlbum/NewAlbum.tsx";
import NewTrack from "./containers/NewTrack/NewTrack.tsx";



const App = () => (
    <>
        <Header />
        <Container maxWidth="lg">
            <Routes>
                <Route path="/" element={<Home/>} />
                <Route path="/register" element={<Register/>}/>
                <Route path="/login" element={<Login/>}/>
                <Route path="/albums" element={<ArtistAlbums/>}/>
                <Route path="/tracks" element={<PrivateRoute><TracksInAlbum/></PrivateRoute>}/>
                <Route path="/trach_history" element={<PrivateRoute><HistoryTrack/></PrivateRoute>}/>
                <Route path="/newArtist" element={<PrivateRoute><NewArtist/></PrivateRoute>}/>
                <Route path="/newAlbum" element={<PrivateRoute><NewAlbum/></PrivateRoute>}/>
                <Route path="/newTrack" element={<PrivateRoute><NewTrack/></PrivateRoute>}/>


                <Route path="*" element={<PageNotFound/>}/>
            </Routes>
        </Container>
    </>
);

export default App
