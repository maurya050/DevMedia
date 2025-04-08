import React, { useState, Fragment } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const {email, password } = formData;

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    // Perform validation
    // const newUser = {
    //   email,
    //   password,
    // };
    try {
        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        };
        const body = JSON.stringify(formData);   
        const res = await axios.post('/api/auth', body, config); // Send POST request to the server
        console.log(res.data); // Handle success 
        console.log('User logged in successfully'); // Handle success
    } catch (err) {
        console.error(err.response.data); // Handle error
    }
    // Handle success
    // console.log('User logged in successfully');
    
  };

  return (
    <Fragment>
        <h1 className="large text-primary">Login</h1>
        <p className="lead">
            <i className="fas fa-user"></i> Sign Into Your Account
        </p>
        <form className="form" onSubmit={onSubmit}>
            <div className="form-group">
            <input
                type="email"
                placeholder="Email Address"
                name="email"
                value={email}
                onChange={(e) => onChange(e)}
                required
            />
            </div>
            <div className="form-group">
            <input
                type="password"
                placeholder="Password"
                name="password"
                value={password}
                onChange={(e) => onChange(e)}
                minLength="6"
            />
            </div>
            <input type="submit" className="btn btn-primary" value="Login" />
        </form>
        <p className="my-1">
            Don't have an account? <Link to="/register">Sign Up</Link>
        </p>
        <p className="my-1">
            Forgot your password? <Link to="/forgot-password">Reset Password</Link>
        </p>
    </Fragment>
  );
};

export default Login;