import React, { useState, Fragment } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { connect } from 'react-redux';
import { setAlert } from '../../actions/alert'; 
import PropTypes from 'prop-types';


const Register = ({setAlert}) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password2: '',
  });

  const { name, email, password, password2 } = formData;

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value }); // Update state with the name of the input field and its value   

  const onSubmit = async (e) => {
    e.preventDefault();
    // Perform validation
    if (password !== password2) {
      setAlert('Passwords do not match', 'danger'); // Show alert if passwords do not match
    } else {
    //   const newUser = {
    //     name,
    //     email,
    //     password,
    //   };
    //     try {
    //         const config = {
    //             headers: {
    //                 'Content-Type': 'application/json'
    //             }
    //         };
    //         const body = JSON.stringify(newUser);   
    //         const res = await axios.post('/api/users', body, config); // Send POST request to the server
    //         console.log(res.data); // Handle success 
    //     } catch (err) {
    //         console.error(err.response.data); // Handle error
    //     }
    // }
        console.log('User registered successfully'); // Handle success
        }
  };

  return (
    <Fragment>
      <h1 className="large text-primary">Sign Up</h1>
      <p className="lead">
        <i className="fas fa-user"></i> Create Your Account
      </p>
      <form className="form" onSubmit={onSubmit}>
        <div className="form-group">
          <input
            type="text"
            placeholder="Name"
            name="name"
            value={name}
            onChange={e => onChange(e)}
            required
          />
        </div>
        <div className="form-group">
          <input
            type="email"
            placeholder="Email Address"
            name="email"
            value={email}
            onChange={onChange}
          />
          <small className="form-text">
            This site uses Gravatar so if you want a profile image, use a
            Gravatar email
          </small>
        </div>
        <div className="form-group">
          <input
            type="password"
            placeholder="Password"
            name="password"
            value={password}
            onChange={onChange}
            minLength="6"
          />
        </div>
        <div className="form-group">
          <input
            type="password"
            placeholder="Confirm Password"
            name="password2"
            value={password2}
            onChange={onChange}
            minLength="6"
          />
        </div>
        <input type="submit" className="btn btn-primary" value="Register" />
      </form>
      <p className="my-1">
        Already have an account? <Link to="/login">Sign In</Link>
      </p>
    </Fragment>
  );
};

Register.propTypes = {
    setAlert: PropTypes.func.isRequired,
    };

export default connect(null, {setAlert})(Register);