import React, { Component } from 'react';
import './Profile.css';
import Info from './info/info';
import Check from './dailycheck/check';
class Profile extends Component {
  
  render() {
    

    return (
      <div className="profile-container">
        <Info/>
        <Check/>
      </div>
    );
  }
}

export default Profile;
