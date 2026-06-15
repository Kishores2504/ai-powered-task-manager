import axios from "axios";
import React, { useEffect, useState } from "react";

const Dashboard = () => {
  const usertoken = localStorage.getItem("ai_application_token");

  const userrole = localStorage.getItem("ai_application_role");

  const [task, set_task] = useState([]);

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
        console.log(task);
        
      console.log(error.response);

      alert(error.response?.data?.message || "Task Fetch Failed");
    }
  };

  useEffect(() => {
    // task_fetcher();
  }, []);
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
                window.location.href = "/";
              }}
            >
              Logout
            </button>
          </div>
        </div>
        <div className="row mt-4">
<div className="col">

          <div className="d-flex justify-content-between align-items-center mb-3">

            <h2 className="fw-bold">
              Tasks Created
            </h2>

            <button
              className="btn btn-dark"
            >
              + New Task
            </button>

          </div>

          {task.length > 0 ? (

            <div className="table-responsive">

              <table className="table table-bordered border-dark text-center align-middle">

                <thead className="table-light">

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

                      <td>{t.createdDate}</td>

                      <td>{t.dueDate}</td>

                      <td>
                        <button
                          className="btn btn-outline-dark btn-sm"
                        >
                          Update
                        </button>
                      </td>

                      <td>
                        <button
                          className="btn btn-dark btn-sm"
                        >
                          Delete
                        </button>
                      </td>

                    </tr>

                  ))}

                </tbody>

              </table>

            </div>

          ) : (

            <div
              className="border border-dark rounded p-5 text-center"
            >
              <h3>No Tasks Created</h3>
            </div>

          )}

        </div>
        </div>
      </div>
  );
};

export default Dashboard;
