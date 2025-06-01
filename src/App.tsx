import './App.css'
import NavBar from './components/nav-bar/NavBar'
import { Routes, Route } from 'react-router-dom';
import Trip from "./components/trip/Trip.tsx";
import TripDetails from "./components/trip/TripDetails.tsx";

function App() {
    return (
        <>
            <NavBar/>
            <Routes>
                <Route path="/trips" element={<Trip />} />
                <Route path="/" element={<Trip />} /> {/* Default route */}
                <Route path="/tripDetail" element={<TripDetails />} />
            </Routes>
        </>
    )
}

export default App