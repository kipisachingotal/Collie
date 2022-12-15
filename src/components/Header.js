import React from 'react';
import "react-responsive-carousel/lib/styles/carousel.min.css";

import { Carousel } from 'react-responsive-carousel';

function Header(props) {
  return (
    <div className="header-box">
      {/* <Carousel showStatus={false} showThumbs={false}> */}
        <div>
          <img style={{height: "150px", width: "450px"}} src={require('../assets/KIPI-Logo.webp')} alt="KIPI Logo" />
        </div>
      {/* </Carousel> */}
    </div>
  );
}

export default Header;