import React, { useState } from "react";
import axios, { Axios } from "axios";
import { useNavigate } from "react-router-dom";
import api from "./api";
const Register = () => {
  var [newUser, set_newUser] = useState(true);
  var navigate = useNavigate();
  var [register_form, set_register_form] = useState({
    name: "",
    email: "",
    password: "",
  });

  var [login_form, set_login_form] = useState({
    email: "",
    password: "",
  });
  var [error, set_error] = useState(null);

  function registervalid() {
    if (register_form.name === "") {
      set_error("Field Name is Empty");
      return true;
    }

    if (register_form.email === "") {
      set_error("Field Email is Empty");
      return true;
    }

    if (
      register_form.email.length < 10 ||
      register_form.email.indexOf("@") === -1
    ) {
      set_error("Field Email is Not Valid");
      return true;
    }

    if (register_form.password === "") {
      set_error("Field Password is Empty");
      return true;
    }

    if (register_form.password.length < 5) {
      set_error("Password should contain more than 5 letters");
      return true;
    }

    set_error(null);
    return false;
  }

  function SubmitregisterForm(e) {
    e.preventDefault();
    if (registervalid()) return;
    else {
      let register = async () => {
        try {
          let response = await api.post("/user/register", register_form);
          if (response.status === 200) {
            console.log(response.data);
            set_error(null);
            set_register_form({ name: "", email: "", password: "" });
            alert(response.data);
          }
        } catch (error) {
          alert(error.response.data);
        }
      };
      register();
    }
  }
  var [login_error, set_login_error] = useState(null);

  function loginvalid() {
    if (login_form.email === "") {
      set_login_error("Field Email is Empty");
      return true;
    }

    if (login_form.email.length < 10 || login_form.email.indexOf("@") === -1) {
      set_login_error("Field Email is Not Valid");
      return true;
    }

    if (login_form.password === "") {
      set_login_error("Field Password is Empty");
      return true;
    }

    if (login_form.password.length < 5) {
      set_login_error("Password should contain more than 5 letters");
      return true;
    }

    set_login_error(null);
    return false;
  }

  function SubmitloginForm(e) {
    e.preventDefault();
    if (loginvalid()) return;
    else {
      let loginrequest = async () => {
        try {
          let response = await api.post("/user/login", login_form);
          if (response.status === 200) {
            alert("Login Success");
            console.log(response.data);
            localStorage.setItem("ai_application_token", response.data.token);
            localStorage.setItem("ai_application_role", response.data.role);
            set_login_error(null);
            set_login_form({ email: "", password: "" });
          }
          window.location.href = "/dashboard";
        } catch (error) {
          alert(error.response.data);
        }
      };
      loginrequest();
    }
  }

  return (
<div
  className="container-fluid d-flex align-items-center justify-content-center min-vh-100"
  style={{
    background: "linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)",
    padding: "2rem 1rem",
  }}
>
  <div 
    className="row justify-content-center align-items-center w-100 g-0 m-0" 
    style={{ maxWidth: "1050px" }}
  >
   
    <div className="col-lg-6 d-none d-lg-flex flex-column justify-content-center text-white pe-lg-5 animate__animated animate__fadeInLeft">
      <span 
        className="badge align-self-start mb-3 px-3 py-2 text-uppercase fw-semibold"
        style={{ background: "rgba(255, 255, 255, 0.15)", backdropFilter: "blur(4px)", letterSpacing: "1px" }}
      >
        Next-Gen Productivity
      </span>
      <h1 className="display-4 fw-extrabold tracking-tight mb-3" style={{ lineHeight: "1.1" }}>
        AI-Powered <br />
        <span style={{ color: "#a78bfa" }}>Task Management</span>
      </h1>
      <p className="fs-5 opacity-85 mb-4 fw-light" style={{ maxWidth: "440px" }}>
        Streamline your workflow, prioritize what truly matters, and unleash intelligence directly into your daily schedule.
      </p>
      <div className="d-flex flex-column mt-2">
        <span className="opacity-75 mb-2 small fw-medium">
          {newUser ? "Already have an account?" : "New to our platform?"}
        </span>
        <button
          className="btn btn-outline-light align-self-start px-4 py-2 rounded-pill fw-medium transition-all"
          style={{ borderWidth: "1.5px" }}
          onClick={(e) => {
            e.preventDefault();
            set_error(null);
            set_login_error(null);
            set_register_form({ name: "", email: "", password: "" });
            set_login_form({ email: "", password: "" });
            set_newUser((prev) => !prev);
          }}
        >
          {newUser ? "Sign In" : "Create Account"}
        </button>
      </div>
    </div>

    
    <div className="col-lg-5 col-md-8 col-sm-11 ms-auto animate__animated animate__fadeInRight">
      {newUser ? (
        <form
          action="post"
          className="p-4 p-md-5 d-flex flex-column gap-3 rounded-4 shadow-2xl border text-white"
          style={{ 
            background: "rgba(255, 255, 255, 0.07)", 
            backdropFilter: "blur(16px)",
            WebkitBackdropFilter: "blur(16px)",
            borderColor: "rgba(255, 255, 255, 0.12)"
          }}
          onSubmit={(e) => SubmitregisterForm(e)}
        >
          <div className="text-center mb-2">
            <h5 className="d-lg-none text-uppercase tracking-wider opacity-70 small mb-2">AI Task Manager</h5>
            <h2 className="fw-bold tracking-tight">Create Account</h2>
            <p className="small opacity-75">Get started with your free workspace today</p>
          </div>

          {error && (
            <div className="alert alert-danger py-2 px-3 small border-0 shadow-sm d-flex align-items-center" style={{ background: "rgba(239, 68, 68, 0.2)", color: "#fca5a5" }}>
              <i className="bi bi-exclamation-triangle-fill me-2"></i> {error}
            </div>
          )}

          <div className="form-group d-flex flex-column gap-1">
            <label htmlFor="registerusername" className="small fw-medium opacity-80">Username</label>
            <input
              type="text"
              id="registerusername"
              placeholder="e.g., john_doe"
              value={register_form.name}
              onChange={(e) => set_register_form({ ...register_form, name: e.target.value })}
              className="form-control text-white border-0 py-2.5 px-3 rounded-3"
              style={{ background: "rgba(255, 255, 255, 0.08)" }}
            />
          </div>

          <div className="form-group d-flex flex-column gap-1">
            <label htmlFor="useremail" className="small fw-medium opacity-80">Email Address</label>
            <input
              type="text"
              id="useremail"
              placeholder="name@example.com"
              value={register_form.email}
              onChange={(e) => set_register_form({ ...register_form, email: e.target.value })}
              className="form-control text-white border-0 py-2.5 px-3 rounded-3"
              style={{ background: "rgba(255, 255, 255, 0.08)" }}
            />
          </div>

          <div className="form-group d-flex flex-column gap-1">
            <label htmlFor="userpassword" className="small fw-medium opacity-80">Password</label>
            <input
              type="password"
              id="userpassword"
              placeholder="••••••••"
              value={register_form.password}
              onChange={(e) => set_register_form({ ...register_form, password: e.target.value })}
              className="form-control text-white border-0 py-2.5 px-3 rounded-3"
              style={{ background: "rgba(255, 255, 255, 0.08)" }}
            />
          </div>

          <button
            className="btn btn-light w-100 py-2.5 mt-3 rounded-3 fw-semibold shadow-sm transition-all text-indigo-700 hover-lift"
            style={{ color: "#4f46e5" }}
            type="submit"
          >
            Register Base
          </button>
          <div className="d-lg-none d-flex align-items-center justify-content-center gap-1 mt-2 small opacity-90">
            <span>Already registered?</span>
            <button
              className="btn btn-link p-0 text-white fw-semibold text-decoration-none border-bottom border-white border-1"
              onClick={(e) => {
                e.preventDefault();
                set_error(null);
                set_login_error(null);
                set_register_form({ name: "", email: "", password: "" });
                set_login_form({ email: "", password: "" });
                set_newUser((prev) => !prev);
              }}
            >
              Sign In
            </button>
          </div>
        </form>
      ) : (
        <form
          action="post"
          className="p-4 p-md-5 d-flex flex-column gap-3 rounded-4 shadow-2xl border text-white"
          style={{ 
            background: "rgba(255, 255, 255, 0.07)", 
            backdropFilter: "blur(16px)",
            WebkitBackdropFilter: "blur(16px)",
            borderColor: "rgba(255, 255, 255, 0.12)"
          }}
          onSubmit={(e) => SubmitloginForm(e)}
        >
          <div className="text-center mb-2">
            <h5 className="d-lg-none text-uppercase tracking-wider opacity-70 small mb-2">AI Task Manager</h5>
            <h2 className="fw-bold tracking-tight">Welcome Back</h2>
            <p className="small opacity-75">Sign in to access your synchronized workspace</p>
          </div>

          {login_error && (
            <div className="alert alert-danger py-2 px-3 small border-0 shadow-sm d-flex align-items-center" style={{ background: "rgba(239, 68, 68, 0.2)", color: "#fca5a5" }}>
              <i className="bi bi-exclamation-triangle-fill me-2"></i> {login_error}
            </div>
          )}

          <div className="form-group d-flex flex-column gap-1">
            <label htmlFor="login_email" className="small fw-medium opacity-80">Email Address</label>
            <input
              type="text"
              id="login_email"
              placeholder="name@example.com"
              value={login_form.email}
              onChange={(e) => set_login_form({ ...login_form, email: e.target.value })}
              className="form-control text-white border-0 py-2.5 px-3 rounded-3"
              style={{ background: "rgba(255, 255, 255, 0.08)" }}
            />
          </div>

          <div className="form-group d-flex flex-column gap-1">
            <label htmlFor="login_password" className="small fw-medium opacity-80">Password</label>
            <input
              type="password"
              id="login_password"
              placeholder="••••••••"
              value={login_form.password}
              onChange={(e) => set_login_form({ ...login_form, password: e.target.value })}
              className="form-control text-white border-0 py-2.5 px-3 rounded-3"
              style={{ background: "rgba(255, 255, 255, 0.08)" }}
            />
          </div>

          <button
            className="btn btn-light w-100 py-2.5 mt-3 rounded-3 fw-semibold shadow-sm transition-all text-indigo-700 hover-lift"
            style={{ color: "#4f46e5" }}
            type="submit"
          >
            Sign In
          </button>
          <div className="d-lg-none d-flex align-items-center justify-content-center gap-1 mt-2 small opacity-90">
            <span>New user?</span>
            <button
              className="btn btn-link p-0 text-white fw-semibold text-decoration-none border-bottom border-white border-1"
              onClick={(e) => {
                e.preventDefault();
                set_error(null);
                set_login_error(null);
                set_register_form({ name: "", email: "", password: "" });
                set_login_form({ email: "", password: "" });
                set_newUser((prev) => !prev);
              }}
            >
              Create Account
            </button>
          </div>
        </form>
      )}
    </div>
  </div>
</div>
  );
};

export default Register;
