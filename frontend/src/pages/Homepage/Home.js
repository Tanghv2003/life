import React, { Component } from 'react';
import MainContent from './MainContent/MainContent';
import Profile from './Profile/Profile';
import './Home.css';  

class Home extends Component {
  render() {
    return (
      <div className="home">
        <div className="home-content">
          <MainContent/>
          <Profile/>
        </div>
      </div>
    );
  }
}

export default Home;
