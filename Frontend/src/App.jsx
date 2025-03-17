import { useState } from 'react'
import CreatePoll from './Pages/Create Poll/CreatePoll'
import SharePoll from './Pages/Share Poll/SharePoll'
import ResultPoll from './Pages/Result Poll/ResultPoll'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import VibeNavbar from './Pages/Header/VibeNavbar';
import Protected from './Pages/Protected';
import LandingPage from './Pages/LandingPage/LandingPage';
import MyPolls from './Pages/MyPolls/MyPolls';

function App() {


  return (
    <>

      <Router>
        <Routes>

          <Route path="/" element={<LandingPage />} />

          <Route path="poll/create" element={
            <CreatePoll />
          } />

          <Route path="/poll/:poll_id" element={
            <SharePoll />
          } />

          <Route path="/poll/:poll_id/result" element={
            <ResultPoll />
          } />

          <Route path="/poll/user/mypolls/" element={
            <MyPolls />
          } />


        </Routes>
      </Router>

    </>
  )
}

export default App
