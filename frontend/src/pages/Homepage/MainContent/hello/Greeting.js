import React from 'react';
import './Greeting.css';
import image from '../../../../assets/bbb.png'; // Đường dẫn đến hình ảnh
import rate from '../../../../assets/rate.png'; // Đường dẫn đến hình ảnh thứ hai

const Greeting = () => {
  return (
    <div className="greeting">
      <div className="greeting__text">
        <h1>Welcome Back</h1>
        <p>Have a nice day</p>
      </div>

      <div className="greeting__images">
        <img src={image} alt="Image 1" className="greeting__image" />
        <img src={rate} alt="Image 2" className="greeting__image" />
      </div>
    </div>
  );
};

export default Greeting;
