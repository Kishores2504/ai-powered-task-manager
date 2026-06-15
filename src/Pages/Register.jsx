import React, { useState } from "react";

const Register = () => {
  var [newUser, set_newUser] = useState(true);

  var [register_form, set_register_form] = useState({
    name: "",
    email: "",
    password: "",
  });

  var [login_form , set_login_form] = useState({
    email :"",
    password :""
  })
  var [error , set_error] = useState(null);

  function registervalid(){  

    if(register_form.name === "" ) {set_error("Field Name is Empty"); return true;}

    if(register_form.email === "") {set_error("Field Email is Empty"); return true;} 

    if(register_form.email.length < 10 || register_form.email.indexOf("@") === -1) {set_error("Field Email is Not Valid"); return true;}
    
    if(register_form.password === "") {set_error("Field Password is Empty"); return true;}

    if(register_form.password.length < 5) {set_error("Password should contain more than 5 letters"); return true;}

    set_error(null);
    return false;
  }

  function SubmitregisterForm(e){
    e.preventDefault();
    if(registervalid()) return;
    else{
      
    }
  }

  function loginForm(e){
    e.preventDefault();
  }

  return (
    <div className="container-md " style={{ height: "100vh" }}>
      <div className="row m-0 flex-md-row justify-content-center column-gap-3 align-items-center h-100">
        <div className="col d-none d-md-block">
          <h4 className="mb-2">Welcome to,</h4>
          <h1 className="display-1 fw-bold">Ai Powered Task Management</h1>
          <div className="mt-3 d-flex flex-column ">
            <h4 className=" text-secondary-emphasis">
              {newUser ? "Already Register ?" : "New User ?"}
            </h4>
            <button
              className="mt-2 align-self-start px-4 rounded-3 bg-transparent border-2"
              onClick={() => {
                set_newUser((prev) => !prev);
              }}
            >
              {newUser ? "Login" : "Register"}
            </button>
          </div>
        </div>
        <div className=" col-md-5 col-sm-12 h-75 d-flex justify-content-center">
          {newUser ? (
            <form
              action="post"
              className="bg-transparent border border-3 p-3 h-100 w-100 d-flex flex-column justify-content-around align-items-center rounded-3 gap-3"
              onSubmit={(e) => SubmitregisterForm(e)}
            >
              <h5 className="d-md-none text-center">
                Ai Powered Task Management{" "}
              </h5>
              <div>
                <h3>Register Form</h3>
                {error && ( <p>{error}</p> )}
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
                  onChange={(e)=>{set_register_form({...register_form ,name : e.target.value})}}
                  className="border-0 border-bottom border-dark"
                  style={{ outline: "none" }}
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
                  onChange={(e)=>{set_register_form({...register_form ,email : e.target.value})}}
                  className="border-0 border-bottom border-dark"
                  style={{ outline: "none" }}
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
                  onChange={(e)=>{set_register_form({...register_form ,password : e.target.value})}}
                  placeholder="User Password"
                  className="border-0 border-bottom border-dark"
                  style={{ outline: "none" }}
                />
              </div>
              <div className="d-flex flex-column row-gap-2 justify-content-md-around align-items-center w-100">
                <button className="btn btn-outline-dark" type="submit">
                  Register
                </button>
                <div className="d-sm-block d-md-none d-flex column-gap-2">
                  <p className="mb-0 ">
                    {newUser ? "Already Register ?" : "New User ?"}{" "}
                  </p>
                  <button
                    className=" align-self-start rounded-3 bg-transparent border-0"
                    onClick={() => {
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
              onSubmit={(e) => loginForm(e)}
            >
              <h5 className="d-md-none text-center">
                Ai Powered Task Management{" "}
              </h5>
              <h3>Login Form</h3>
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
                  onChange={(e)=>{set_login_form({...login_form , email : e.target.value})}}
                  className="border-0 border-bottom border-dark"
                  style={{ outline: "none" }}
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
                  className="border-0 border-bottom border-dark"
                  value={login_form.password}
                  onChange={(e)=>{set_login_form({...login_form , password : e.target.value})}}
                  style={{ outline: "none" }}
                />
              </div>
              <div className="d-flex flex-column row-gap-2 justify-content-around align-items-center w-100">
                <button className="btn btn-outline-dark">Login</button>
                <div className="d-sm-block d-md-none d-flex column-gap-2 align-items-center justif-content-center">
                  <p className="mb-0">
                    {newUser ? "Already Register ?" : "New User ?"}{" "}
                  </p>
                  <button
                    className=" align-self-start rounded-3 bg-transparent border-0"
                    onClick={() => {
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
