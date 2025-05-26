import './App.css'
import NavBar from './components/nav-bar/NavBar'
import { Routes, Route } from 'react-router-dom';
import Trip from "./components/trip/Trip.tsx";

function App() {

  return (
    <>
        <NavBar/>
        <Routes>
            <Route path="/"  Component={Trip} />
            <Route path="trips"  Component={Trip} />
            {/*<Route path="/statistic" Component={StatisticDashboard} />*/}
        </Routes>
    </>
  )
}

export default App
