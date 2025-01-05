// src/App.js
import React, { Component } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Homepage/Home';
import './App.css'
import HistoryPage from './pages/HistoryPage/HistoryPage';
import AdvicePage from './pages/AdvicePage/AdvicePage'
import InsightPage from './pages/InsightPage/InsightPage'

class App extends Component {
  render() {
    return (
      <Router>
        <div className='app'>
          {/* Navbar */}
          <Navbar />

          {/* Các tuyến đường */}
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="history" element={<HistoryPage />} />
            <Route path="about" element = {<Home/>}/>
            <Route path="insights" element = {<InsightPage/>}/>
            <Route path="advice" element = {<AdvicePage/>}/>
          </Routes>
        </div>
      </Router>
    );
  }
}

export default App;
