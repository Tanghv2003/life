import React, { Component } from 'react';
import '@fortawesome/fontawesome-free/css/all.min.css';
import '../styles/Header.css';
import Noti from '../assets/notification.png'; // Hình ảnh thông báo
import Snow from '../assets/snowflake .png'; // Hình ảnh tuyết


class Header extends Component {
  render() {
    return (
      <div className="header">
        {/* Container bao bọc cả tiêu đề và thanh tìm kiếm */}
        <div className="header__container">
          {/* Thanh tìm kiếm */}
          <div className="header__search">
            <div className="header__search-input">
              <input type="text" placeholder="Search here..." />
              <button type="button" className="header__search-button">
                <i className="fa fa-search"></i> {/* Icon search */}
              </button>
            </div>
          </div>
          
          {/* Nút thông báo */}
          <button className="header__icon-button1">
            <img src={Noti} alt="Notification" className="header__icon" />
          </button>

          {/* Nút tuyết */}
          <button className="header__icon-button2">
            <img src={Snow} alt="Snowflake" className="header__icon" />
          </button>
        </div>

        
      </div>
    );
  }
}

export default Header;
