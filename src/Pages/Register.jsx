import React, { useState } from "react";

const Register = () => {
  var [newUser, set_newUser] = useState(true);

  return (
    <>
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
            <form
              action="post"
              className="bg-transparent border border-3 p-3 h-100 w-100 d-flex flex-column justify-content-around align-items-center rounded-3"
            >
              <h1 className="d-md-none">Ai Powered Task Management </h1>
              {newUser ? (
                <>
                  <h1>Register Form</h1>
                  <div className="d-flex justify-content-around align-items-center w-100">
                    <label
                      htmlFor="username"
                      className="fs-5 fw-semibold text-secondary"
                    >
                      User Name :
                    </label>
                    <input
                      type="text"
                      name="username"
                      id=""
                      placeholder="User Name"
                      className="border-0 border-bottom border-dark"
                      style={{ outline: "none" }}
                    />
                  </div>
                  <div className="d-flex justify-content-around w-100">
                    <label
                      htmlFor="useremail"
                      className="fs-5 fw-semibold text-secondary"
                    >
                      User Email :
                    </label>
                    <input
                      type="text"
                      name="useremail"
                      id=""
                      placeholder="User Email"
                      className="border-0 border-bottom border-dark"
                      style={{ outline: "none" }}
                    />
                  </div>
                  <div className="d-flex justify-content-around w-100">
                    <label
                      htmlFor="userpassword"
                      className="fs-5 fw-semibold text-secondary"
                    >
                      User Password :
                    </label>
                    <input
                      type="password"
                      name="userpassword"
                      id=""
                      placeholder="User Password"
                      className="border-0 border-bottom border-dark"
                      style={{ outline: "none" }}
                    />
                  </div>
                  <div className="d-flex flex-column row-gap-2 justify-content-around align-items-center w-100">
                    <button className="btn btn-outline-dark">Register</button>
                    <div className="d-sm-block d-md-none d-flex column-gap-2">
                      <p className="mb-0 mt-2">
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
                </>
              ) : (
                <>
                  <h1>Login Form</h1>
                  <div className="d-flex justify-content-around w-100">
                    <label
                      htmlFor="useremail"
                      className="fs-5 fw-semibold text-secondary"
                    >
                      User Email :
                    </label>
                    <input
                      type="text"
                      name="useremail"
                      id=""
                      placeholder="User Email"
                      className="border-0 border-bottom border-dark"
                      style={{ outline: "none" }}
                    />
                  </div>
                  <div className="d-flex justify-content-around w-100">
                    <label
                      htmlFor="userpassword"
                      className="fs-5 fw-semibold text-secondary"
                    >
                      User Password :
                    </label>
                    <input
                      type="password"
                      name="userpassword"
                      id=""
                      placeholder="User Password"
                      className="border-0 border-bottom border-dark"
                      style={{ outline: "none" }}
                    />
                  </div>
                  <div className="d-flex flex-column row-gap-2 justify-content-around align-items-center w-100">
                    <button className="btn btn-outline-dark">Login</button>
                    <div className="d-sm-block d-md-none d-flex column-gap-2 align-items-center justif-content-center">
                      <p className="mb-0 mt-2">
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
                </>
              )}
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Register;
