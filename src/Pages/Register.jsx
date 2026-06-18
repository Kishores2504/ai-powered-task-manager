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
      className="container-fluid "
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg , #6366F1 ,#8B5CF6)",
      }}
    >
      <div className="row m-0 justify-content-center align-items-center h-100 mt-5 pt-5">
        <div className="col-lg-6 d-none d-md-block">
          <h4 className="text-white">Welcome to</h4>
          <h1 className="display-3 fw-bold text-white">
            Ai Powered <br /> Task Management
          </h1>
          <p className="text-white fs-5 mt-3">
            Organize Tasks.
            <br />
            Prioritize Work.
            <br />
            Let AI Assist You.
          </p>
          <div className="mt-3 d-flex flex-column ">
            <h4 className=" text-secondary-emphasis">
              {newUser ? "Already Register ?" : "New User ?"}
            </h4>
            <button
              className="btn btn-light mt-3 px-4"
              onClick={(e) => {
                e.preventDefault();
                set_error(null);
                set_login_error(null);
                set_register_form({ name: "", email: "", password: "" });
                set_login_form({ email: "", password: "" });
                set_newUser((prev) => !prev);
              }}
            >
              {newUser ? "Login" : "Register"}
            </button>
          </div>
        </div>
        <div className="col-lg-4 col-md-6 col-sm-12">
          {newUser ? (
            <form
              action="post"
              className="bg-white shadow-lg border-0 p-4 w-100 rounded-4 d-flex flex-column gap-4"
              onSubmit={(e) => SubmitregisterForm(e)}
            >
              <h5 className="d-md-none text-center">
                Ai Powered Task Management{" "}
              </h5>
              <div>
                <h3 className="fw-bold text-center text-primary">
                  Create Account
                </h3>
                {error && (
                  <div className="alert alert-danger py-2">{error}</div>
                )}
              </div>
              <div className="d-flex flex-column flex-md-row justify-content-around row-gap-2  w-100">
                <label
                  htmlFor="registerusername"
                  className="fs-5 fw-semibold text-secondary"
                >
                  User Name :
                </label>
                <input
                  type="text"
                  id="registerusername"
                  placeholder="User Name"
                  value={register_form.name}
                  onChange={(e) => {
                    set_register_form({
                      ...register_form,
                      name: e.target.value,
                    });
                  }}
                  className="form-control"
                />
              </div>
              <div className="d-flex flex-column flex-md-row justify-content-around row-gap-2 w-100">
                <label
                  htmlFor="useremail"
                  className="fs-5 fw-semibold text-secondary"
                >
                  User Email :
                </label>
                <input
                  type="text"
                  id="useremail"
                  placeholder="User Email"
                  value={register_form.email}
                  onChange={(e) => {
                    set_register_form({
                      ...register_form,
                      email: e.target.value,
                    });
                  }}
                  className="form-control"
                />
              </div>
              <div className="d-flex flex-column flex-md-row justify-content-around row-gap-2 w-100">
                <label
                  htmlFor="userpassword"
                  className="fs-5 fw-semibold text-secondary"
                >
                  User Password :
                </label>
                <input
                  type="password"
                  id="userpassword"
                  value={register_form.password}
                  onChange={(e) => {
                    set_register_form({
                      ...register_form,
                      password: e.target.value,
                    });
                  }}
                  placeholder="User Password"
                  className="form-control"
                />
              </div>
              <div className="d-flex flex-column row-gap-2 justify-content-md-around align-items-center w-100">
                <button
                  className="btn text-white w-100"
                  style={{ background: "#6366F1" }}
                  type="submit"
                >
                  Register
                </button>
                <div className="d-sm-block d-md-none d-flex column-gap-2">
                  <p className="mb-0 ">
                    {newUser ? "Already Register ?" : "New User ?"}{" "}
                  </p>
                  <button
                    className="btn btn-link text-primary"
                    onClick={(e) => {
                      e.preventDefault();
                      set_error(null);
                      set_login_error(null);
                      set_register_form({ name: "", email: "", password: "" });
                      set_login_form({ email: "", password: "" });
                      set_newUser((prev) => !prev);
                    }}
                  >
                    {newUser ? "Login" : "Register"}
                  </button>
                </div>
              </div>
            </form>
          ) : (
            <form
              action="post"
              className="bg-transparent border border-3 p-3 h-100 w-100 d-flex flex-column justify-content-around align-items-center rounded-3 gap-3"
              onSubmit={(e) => SubmitloginForm(e)}
            >
              <h5 className="d-md-none text-center fw-bold text-primary">
                Ai Powered Task Management{" "}
              </h5>
              <h3 className="fw-bold text-center text-primary">Login Form</h3>
              {login_error && (
                <div className="alert alert-danger py-2">{login_error}</div>
              )}
              <div className="d-flex flex-column flex-md-row justify-content-around row-gap-2 w-100">
                <label
                  htmlFor="login_email"
                  className="fs-5 fw-semibold text-secondary"
                >
                  User Email :
                </label>
                <input
                  type="text"
                  id="login_email"
                  placeholder="User Email"
                  value={login_form.email}
                  onChange={(e) => {
                    set_login_form({ ...login_form, email: e.target.value });
                  }}
                  className="form-control"
                />
              </div>
              <div className="d-flex flex-column flex-md-row justify-content-around row-gap-2 w-100">
                <label
                  htmlFor="login_password"
                  className="fs-5 fw-semibold text-secondary"
                >
                  User Password :
                </label>
                <input
                  type="password"
                  id="login_password"
                  placeholder="User Password"
                  className="form-control"
                  value={login_form.password}
                  onChange={(e) => {
                    set_login_form({ ...login_form, password: e.target.value });
                  }}
                />
              </div>
              <div className="d-flex flex-column row-gap-2 justify-content-around align-items-center w-100">
                <button
                  className="btn text-white w-100"
                  style={{
                    background: "#6366F1",
                  }}
                >
                  Login
                </button>
                <div className="d-sm-block d-md-none d-flex column-gap-2 align-items-center justif-content-center">
                  <p className="mb-0">
                    {newUser ? "Already Register ?" : "New User ?"}{" "}
                  </p>
                  <button
                    className=" align-self-start rounded-3 bg-transparent border-0"
                    onClick={(e) => {
                      e.preventDefault();
                      set_error(null);
                      set_login_error(null);
                      set_register_form({ name: "", email: "", password: "" });
                      set_login_form({ email: "", password: "" });
                      set_newUser((prev) => !prev);
                    }}
                  >
                    {newUser ? "Login" : "Register"}
                  </button>
                </div>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Register;
