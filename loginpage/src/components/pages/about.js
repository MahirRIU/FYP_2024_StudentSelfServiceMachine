import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import './about.css';

const About = () => {
  const [user, setuser] = useState(
    {
      name: '', sapid:'',email:'',fathername:'',cgpa:'',gender:''
    }
  )
  let name,value;
  const navigate = useNavigate();
  console.log(user)
  const data = (e) =>{
    name = e.target.name;
    value = e.target.value;
    setuser({...user,[name]: value})
    
  }
  const getdata = async(e) =>{
  console.log(user)
    const { name, sapid,email,fathername,cgpa,gender} = user;
    e.preventDefault(); 
    const options ={
    method: 'POST',
    headers:{ 
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      name, sapid,email,fathername,cgpa,gender
    })
  }
  const res = await fetch('https://siss-a83fb-default-rtdb.firebaseio.com/Userdata.json',options)
  if(res){
    
    navigate("/paymentpage")
  }
  else{
    alert("error occured")
  }
  
  }
  
  return (
    <div className="about-container">
      <h1>Transcript Form</h1>
      <form method='POST'>
        <div>
          <label htmlFor="name">Name:</label>
          <input id="name" className="name" required type="text" name='name' value={user.name}  onChange={data}/>
        </div>
        <div>
          <label htmlFor="sapId">Sap ID:</label>
          <input id="sapId" className="sapid" required type="number" name='sapid' value={user.sapid} onChange={data} />
        </div>
        <div>
          <label htmlFor="email">Email:</label>
          <input id="email" className="email" required type="email" name='email' value={user.email} onChange={data}/>
        </div>
        <div>
          <label htmlFor="fatherName">Father Name:</label>
          <input id="fatherName" className="fathername" required type="text" name='fathername' value={user.fathername} onChange={data}/>
        </div>
        <div>
          <label htmlFor="cgpa">CGPA:</label> 
          <input id="cgpa" className="cgpa" required type="number" name='cgpa' value={user.cgpa} onChange={data}/>
        </div>
        <div>
          <label htmlFor="gender">Gender:</label>
          <select id="gender" name='gender' value={user.gender} onChange={data}>
            <option value="male" name='gender'>Male</option>
            <option value="female" name='gender'>Female</option>
            <option value="other" name='gender'>Other</option>
          </select>
        </div>
        <button type="submit" onClick={getdata}>Submit</button>
      </form>
    </div>
  );
};

export default About;
