import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import '../styles/Navbar.css';
import Homeicon from '../../src/assets/home.png';
import HistoryIcon from '../../src/assets/history.png';
import AnalyticsIcon from '../../src/assets/aa.png';
import StarIcon from '../../src/assets/star.png';
import OutIcon from '../../src/assets/out.png';

class Navbar extends Component {
  render() {
    const navItems = [
      { to: '/', icon: Homeicon, alt: 'Home' },
      { to: '/history', icon: HistoryIcon, alt: 'History' },
      { to: '/insights', icon: AnalyticsIcon, alt: 'Insights' },
      { to: '/advice', icon: StarIcon, alt: 'Advice' },
      { to: '/logout', icon: OutIcon, alt: 'Logout' },
    ];

    return (
      <nav className="navbar">
        {/* Tiêu đề Navbar */}
        <div className="navbar-title">
          <span className="navbar-title-hust">HUST</span>
          <br />
          <span className="navbar-title-life">LIFE</span>
        </div>

        {/* Danh sách mục */}
        <ul className="navbar-list">
          {navItems.map((item, index) => (
            <li key={index} className="navbar-item">
              <NavLink
                to={item.to}
                exact={item.to === '/'}
                activeClassName="active"
                className="navbar-link"
              >
                <img src={item.icon} alt={item.alt} className="navbar-icon" />
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    );
  }
}

export default Navbar;
