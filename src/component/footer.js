import React from 'react';

function FooterBar() {
  return (
    <footer className='courgette-font'>
      <p>&copy; Storytree 2024</p>
      <p>Contact us:<br />
        <a href="mailto:jguo25@uw.edu"><span className="material-icons" aria-label="Email"></span> jguo25@uw.edu</a>
        <a href="mailto:miked232@uw.edu"><span className="material-icons" aria-label="Email"></span> miked232@uw.edu</a>
        <a href="mailto:tvuu@uw.edu"><span className="material-icons" aria-label="Email"></span> tvuu@uw.edu</a>
        <a href="mailto:ainslai@uw.edu"><span className="material-icons" aria-label="Email"></span> ainslai@uw.edu</a>
      </p>  
      <p>Developed by Katherine Guo, Mike Deng, Tyler Vuu, Ainsley Tsz-Lam Lai</p>
    </footer>
  );
}

export default FooterBar;
