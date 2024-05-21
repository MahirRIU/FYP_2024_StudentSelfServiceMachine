// import logo from './logo.svg';
import './App.css';
// import Login from "./components/login/login.jsx";
import Home from "./components/Home/Home.js";
import Login1 from "./components/Login1/login1.js";
import Signup from "./components/signup/signup.js";
import MainScreen from './components/pages/mainscreen.js';
import Logout from './components/pages/logout.js'
import Analytics from './components/pages/analytics.js'
import Dashboard from './components/pages/dashboard.js'
import Comment from './components/pages/comments.js'
import About from './components/pages/about.js';
import Payment from './components/pages/PaymentPage.js'
 // Update the component name to start with an uppercase letter
import {BrowserRouter as Router,Routes,Route} from "react-router-dom";
import { useEffect, useState } from 'react';
import { auth } from './firebase.js';
function App() {
  const [userName, setUserName] = useState("")
  useEffect(()=>{
    auth.onAuthStateChanged((user)=>{
      if(user){
        setUserName(user.displayName)
      }
      else setUserName("")
      console.log(user);
    })
  },[])
  return (
    <div>
      {/* <Login /> Use uppercase component name */}
      <Router>
        <Routes>
        <Route path='/paymentpage' element={<Payment />}/>
        <Route path='/logout' element={<Logout />}/>
        <Route path='/transcript_track' element={<Analytics />}/>
        <Route path='/comment' element={<Comment />}/>
        <Route path='/transcript' element={<About />}/>
        <Route path='/userdashboard' element={<Dashboard />}/>
          <Route path='/mainscreen' element={<MainScreen />}/>
          <Route path='/' element={<Login1 />}/>
          <Route path='/signup' element={<Signup />}/>
          {/* <Route path='/' element={<Home name={userName}/>}/> */}
        </Routes>
      </Router>
    </div>
  );
}

export default App;
