import axios from "axios";
import React, { useEffect, useState } from "react";
import styles from "./Dashboard.module.css";

const Dashboard = () => {
  const usertoken = localStorage.getItem("ai_application_token");

  const userrole = localStorage.getItem("ai_application_role");

  const [task, set_task] = useState([]);
  console.log(usertoken);
  
  const task_fetcher = async () => {
    try {
      const response = await axios.get("http://localhost:8080/user/alltasks", {
        headers: {
          Authorization: `Bearer ${usertoken}`,
          "Content-Type": "application/json",
        },
      });

      if (response.status === 200) {
        set_task(response.data);
        console.log(task);
      }
    } catch (error) {
      console.log(error);
    }
  };

  var [hideSuggesion, set_hideSuggestion] = useState(true);
  const [suggestion, set_suggestion] = useState({
    title: "",
    description: "",
    priority: "",
    estimatedTime: "",
  });

  // if (!hideSuggesion) {
  //   setTimeout(() => {
  //     set_hideSuggestion(true);
  //   }, 1000 * 60);
  // }

  var [loading, setloading] = useState(false);

  var initializeAirequest = async (e) => {
    e.preventDefault();
    if (suggestion.title === "") {
      alert("Fill the Title for AI Suggestion");
      return;
    }
    try {
      setloading(true);
      let response = await axios.post(
        "http://localhost:8080/ai/taskSuggestion",
        { title: suggestion.title },
        {
          headers: {
            authorization: `Bearer ${usertoken}`,
            "Content-Type": "application/json",
          },
        },
      );
      if(response.status === 200){
        set_hideSuggestion(false);
        
        set_suggestion({
          title : response.data.Title,
          description:response.data.description,
          priority : response.data.priority,
          estimatedTime : response.data.estimatedTime
        })
      }
    } catch (error) {
      alert("Failed to Make Suggestion")
      console.log(error);
    } finally {
      setloading(false);
    }
  };

  useEffect(() => {
    task_fetcher();
  }, [usertoken]);
  return (
    <div className="container-fluid py-4">
      <div className="row  align-items-center border-bottom pb-3 ">
        <div className="col">
          <h1 className="fw-bold">Welcome to dashboard</h1>
        </div>
        <div className="col-auto">
          <button
            className="btn btn-outline-dark"
            onClick={() => {
              localStorage.removeItem("ai_application_token");
              localStorage.removeItem("ai_application_role");
              window.location.href = "/";
            }}
          >
            Logout
          </button>
        </div>
      </div>

      <div className="row mt-4">
        <div className="col">
          <div className="border border-secondary rounded p-4">
            <h3 className="mb-3 fw-bold">Ai Task Suggestion</h3>
            <div className="row gap-3 justify-content-center">
              <div className="col-md-8">
                <input
                  type="text"
                  name=""
                  id=""
                  className="form-control border-dark"
                  placeholder="Enter Task Title"
                  value={suggestion.title}
                  onChange={(e) =>
                    set_suggestion({ ...suggestion, title: e.target.value })
                  }
                />
              </div>
              <div className="col-md-3">
                <button
                  className="btn btn-dark w-100"
                  onClick={(e) => {
                    initializeAirequest(e);
                  }}
                >
                  Get Suggestion
                </button>
              </div>
              {loading && (
                <div className="col d-flex align-items-center">
                  <span className={`${styles.roundone} ${styles.round}`}></span>
                  <span className={`${styles.roundtwo} ${styles.round}`}></span>
                </div>
              )}
            </div>
            {hideSuggesion === false && (
              <div className="row mt-3 ">
                <div className="col d-none d-md-flex flex-column justify-content-center ">
                  <button className="align-self-end p-1 btn btn-outline-dark" title="Close Suggestion" onClick={()=>{
                    set_suggestion({
                      title:"",
                      description:"",
                      priority:"",
                      estimatedTime:""
                    })
                    set_hideSuggestion(true);
                  }}>X</button>
                  <table className="table">
                    <thead className="">
                      <tr>
                        <th>Title</th>
                        <th>Description</th>
                        <th>Priority</th>
                        <th>Estimated Time</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>{suggestion.title}</td>
                        <td>{suggestion.description}</td>
                        <td>{suggestion.priority}</td>
                        <td>{suggestion.estimatedTime}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div className="col d-block d-md-none">
                  <div className="row">
                    <div className="col-12">
                      <p>Title :</p>
                      <p>{suggestion.title}</p>
                    </div>
                    <div className="col-12">
                      <p>Description :</p>
                      <p>{suggestion.description}</p>
                    </div>
                    <div className="col-12">
                      <p>Priority :</p>
                      <p>{suggestion.priority}</p>
                    </div>
                    <div className="col-12">
                      <p>Estimated Time :</p>
                      <p>{suggestion.estimatedTime}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="row mt-4">
        <div className="col">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h2 className="fw-bold">Tasks Created</h2>
            <button className="btn btn-dark">+ New Task</button>
          </div>
            <div className=" row p-4 m-0 border border-dark rounded-3 mb-3">  
              <form action=""  className={ `${styles.addTaskform} col d-flex flex-column flex-md-row gap-2 justify-content-around`}>
                <div className="d-flex flex-column flex-md-row align-items-md-center gap-2">
                  <label htmlFor="">Title</label>
                  <input type="text" name="" id="" placeholder="Task Title"/>
                </div>
                <div className="d-flex flex-column flex-md-row align-items-md-center gap-2">
                  <label htmlFor="">Description</label>
                  <textarea name="" id="" style={{resize:"none" , minHeight:"50px"}} placeholder="Task Description"></textarea>
                </div>
                <div className="d-flex flex-column flex-md-row align-items-md-center gap-2">
                  <label htmlFor="">Priority</label>
                  <select name="" id="">
                    <option value="" defaultChecked>Low</option>
                    <option value="">High</option>
                  </select>
                </div>
                <div className="d-flex flex-column flex-md-row align-items-md-center gap-2">
                  <label htmlFor="">Status</label>
                  <select name="" id="">
                    <option value="" defaultChecked>Todo</option>
                    <option value="">In Process</option>
                    <option value="">Done</option>
                  </select>
                </div>
                <div className="d-flex flex-column flex-md-row align-items-md-center gap-2">
                  <label htmlFor="">Due Date</label>
                 <input type="date" name="" id="" />
                </div>
                <div className="d-flex flex-column flex-md-row align-items-md-center gap-2">
                  <button className="btn btn-outline-dark">Add Task</button>
                </div>
              </form>
              </div>
          {task.length > 0 ? (
            <div className="table-responsive">
              <table className=" table table-bordered border-dark text-center align-middle">
                <thead className="table table-border border-dark">
                  <tr>
                    <th>Title</th>
                    <th>Description</th>
                    <th>Priority</th>
                    <th>Status</th>
                    <th>Created Date</th>
                    <th>Due Date</th>
                    <th>Update</th>
                    <th>Delete</th>
                  </tr>
                </thead>

                <tbody>
                  {task.map((t, index) => (
                    <tr key={index}>
                      <td>{t.title}</td>

                      <td>{t.description}</td>

                      <td>{t.priority}</td>

                      <td>{t.status}</td>

                      <td>{t.createdat}</td>

                      <td>{t.dueDate}</td>

                      <td>
                        <button className="btn btn-outline-dark btn-sm">
                          Update
                        </button>
                      </td>

                      <td>
                        <button className="btn btn-dark btn-sm">Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="border border-dark rounded p-5 text-center">
              <h3>No Tasks Created</h3>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
