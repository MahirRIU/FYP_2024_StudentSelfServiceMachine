import React, { useState } from 'react';
import { FaTh, FaUserAlt, FaSignOutAlt, FaCommentAlt, FaBars, FaSearch } from "react-icons/fa";
import { NavLink } from 'react-router-dom';
import './mainscreen.css';

const Mainscreen = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const toggle = () => setIsOpen(!isOpen);
  const menuItem = [
    {
      path: "/",
      name: "Dashboard",
      icon: <FaTh />
    },
    {
      path: "/Transcript",
      name: "Transcript",
      icon: <FaUserAlt />
    },
    {
      path: "/transcript_track",
      name: "confirmation",
      icon: <FaSearch />
    },
    {
      path: "/comment",
      name: "Feedback",
      icon: <FaCommentAlt />
    },
    {
      path: "/logout",
      name: "Logout",
      icon: <FaSignOutAlt />
    },
  ];

  return (
    <div className="container">
      <div style={{ width: isOpen ? "300px" : "50px" }} className="sidebar">
        <div className='top_section'>
          <h1 style={{ display: isOpen ? "block" : "none" }} className='logo'>Logo</h1>
          <div style={{ marginLeft: isOpen ? "300px" : "50px" }} className='bars'>
            <FaBars onClick={toggle}/>
          </div>
          <button onClick={toggle} className="toggle-btn">{isOpen ? "SSSM" : "SSSM"}</button>
        </div>
        
        {menuItem.map((item, index) => (
          <NavLink to={item.path} key={index} className="link" activeClassName="active">
            <div className='icon'>{item.icon}</div>
            <div style={{ display: isOpen ? "block" : "none" }} className='link_text'>{item.name}</div>
          </NavLink>
        ))}
        
      </div>
      <main>
        <h1>WELCOME TO SSSM</h1>
        <div class="btn-container">
    <button class="btn"><a href="https://moellim.riphah.edu.pk/login/index.php" target="_blank">Moellim</a></button>
    <button class="btn"><a href="https://web.whatsapp.com/">Whatsapp</a></button>
    <button class="btn"><a href="https://fiori.riphah.edu.pk:8011/sap/bc/ui2/flp?_sap-hash=I1NoZWxsLWhvbWU">Fiori</a></button>
</div>
<div class="btn-container">
    <button class="btn"><a href="https://mail.google.com/mail">Gmail</a></button>
    <button class="btn"><a href="https://onedrive.live.com/login">OneDrive</a></button>
    <button class="btn"><a href="">USB-port</a></button>
</div>

      </main>
    
    </div>
  );
}

export default Mainscreen;
