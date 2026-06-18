import axios from "axios";
import React, { useEffect, useState } from "react";
import styles from "./Dashboard.module.css";
import api from "./api";
const Dashboard = () => {
  const usertoken = localStorage.getItem("ai_application_token");

  const userrole = localStorage.getItem("ai_application_role");

  const [taskList, set_taskList] = useState([]);
  console.log(usertoken);

  const task_fetcher = async () => {
    try {
      const response = await api.get("/user/alltasks", {
        headers: {
          Authorization: `Bearer ${usertoken}`,
          "Content-Type": "application/json",
        },
      });

      if (response.status === 200) {
        set_taskList(response.data);
        console.log(taskList);
      }
    } catch (error) {
      set_taskList([]);
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
      let response = await api.post(
        "/ai/taskSuggestion",
        { title: suggestion.title },
        {
          headers: {
            authorization: `Bearer ${usertoken}`,
            "Content-Type": "application/json",
          },
        },
      );
      if (response.status === 200) {
        set_hideSuggestion(false);

        set_suggestion({
          title: response.data.Title,
          description: response.data.description,
          priority: response.data.priority,
          estimatedTime: response.data.estimatedTime,
        });
      }
    } catch (error) {
      alert("Failed to Make Suggestion");
      console.log(error);
    } finally {
      setloading(false);
    }
  };

  var [view_addtaskform, set_view_addtaskform] = useState(false);
  var [addTaskObject, set_addTaskObject] = useState({
    title: "",
    description: "",
    priority: "",
    dueDate: "",
    status: "",
  });

  var [addtask_error, set_addtask_error] = useState("");

  function add_task_validation(obj) {
    if (obj.title === "") {
      set_addtask_error("Field Title is Empty");
      return true;
    }
    if (obj.description === "") {
      set_addtask_error("Field Description is Empty");
      return true;
    }
    if (obj.priority === "" || obj.priority === "Default") {
      set_addtask_error("Set Priority");
      return true;
    }
    if (obj.status === "" || obj.status === "Default") {
      set_addtask_error("Set Status");
      return true;
    }
    if (obj.dueDate === "" || new Date(obj.dueDate) <= Date.now()) {
      set_addtask_error("Set a Due Date");
      return true;
    }
    set_addtask_error("");
    return false;
  }
  var addtaskformSubmission = async (e) => {
    e.preventDefault();
    if (add_task_validation(addTaskObject)) return;
    try {
      let response = await api.post("/user/addtask", addTaskObject, {
        headers: {
          authorization: `Bearer ${usertoken}`,
          "Content-Type": "Application/json",
        },
      });
      if (response.status === 200) {
        console.log(response.data);
        task_fetcher();
        alert("Task Added successfully");
      }
    } catch (error) {
      alert(error.response.data);
    } finally {
      set_addTaskObject({
        title: "",
        description: "",
        createdat: String(Date.now()),
        dueDate: "",
        priority: "",
        status: "",
      });
    }
  };

  var deleteTaskById = async (taskid) => {
    try {
      let response = await api.delete(`/user/deletetask/${taskid}`, {
        headers: {
          authorization: `Bearer ${usertoken}`,
          "Content-Type": "Application/json",
        },
      });
      if (response.status === 200) {
        console.log(response.data);
        task_fetcher();
      }
    } catch (error) {
      console.log(error);
    }
  };

  var [task_update_formVisiblity, set_task_update_formVisiblity] =
    useState(false);
  // this id is got from task list index values not original task id
  var [update_taskid, set_update_taskid] = useState(-1);
  // so this task update act as our task update obj as well as the initial update object
  var [task_update_form, set_task_update_form] = useState({});
  // so why we here used useeffect insteaded of using state ? the state has its initial value once and dont rerender or change it initial value
  // so it not change anything that's why when we do things it get worse.
  var [objecToCheckUpdate, set_objectToCheckUpdate] = useState({});
  useEffect(() => {
    var task = taskList.find((e) => e.taskid == update_taskid);
    set_task_update_form(task ? task : {});
    set_objectToCheckUpdate(task ? task : {});
  }, [update_taskid]);

  console.log(task_update_form);

  function compareObjects(obj1, obj2) {
    console.log(obj1);
    console.log(obj2);
    return (
      obj1.title.includes(obj2.title) === true &&
      obj1.description.includes(obj2.description) === true &&
      obj1.status.includes(obj2.status) === true &&
      obj1.priority.includes(obj2.priority) === true &&
      obj1.dueDate.includes(obj2.dueDate) === true
    );
  }
  function update_object_valid() {
    return compareObjects(objecToCheckUpdate, task_update_form);
  }

  var update_form_submit = async () => {
    console.log("reached update request");
    console.log(update_object_valid());
    if (update_object_valid()) {
      alert("No Changes Made.");
      return;
    }
    try {
      console.log(task_update_form);
      console.log("entered try");
      let response = await api.patch(
        `/user/updatetask?taskid=${update_taskid}`,
        task_update_form,
        {
          headers: {
            authorization: `Bearer ${usertoken}`,
            "Content-Type": "Application/json",
          },
        },
      );
      if (response.status === 200) {
        alert(response.data);
        task_fetcher();
      }
    } catch (error) {
      console.log(error);
    } finally {
      set_task_update_form({});
      set_task_update_formVisiblity(false);
      set_update_taskid(-1);
    }
  };

  useEffect(() => {
    task_fetcher();
  }, []);
  return (
    <div
      className="container-fluid py-4 mt-4"
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg , #eef2ff 0%, #f5f3ff 100%)",
      }}
    >
      <div className="row  align-items-center p-4 rounded-4 shadow-sm bg-white mb-4 ">
        <div className="col">
          <>
            <h2 className="fw-bold mb-1">Welcome Back</h2>

            <p className="text-muted mb-0">
              Manage your tasks intelligently with AI
            </p>
          </>
        </div>
        <div className="col-auto">
          <button
            className="btn text-white"
            style={{ background: "#6366F1", border: "none" }}
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
          <div className="card border-0 shadow-lg rounded-4">
            <div className="card-body p-4">
              <h3 className="fw-bold text-primary">Ai Task Suggestion</h3>
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
                    className="btn text-white w-100"
                    onClick={(e) => {
                      initializeAirequest(e);
                    }}
                    style={{ background: "#6366F1" }}
                  >
                    Get Suggestion
                  </button>
                </div>
                {loading && (
                  <div className="col d-flex align-items-center">
                    <span
                      className={`${styles.roundone} ${styles.round}`}
                    ></span>
                    <span
                      className={`${styles.roundtwo} ${styles.round}`}
                    ></span>
                  </div>
                )}
              </div>
              {hideSuggesion === false && (
                <div className="row mt-3 ">
                  <div className="col d-none d-md-flex flex-column justify-content-center ">
                    <button
                      className="align-self-end p-1 btn btn-outline-dark"
                      title="Close Suggestion"
                      onClick={() => {
                        set_suggestion({
                          title: "",
                          description: "",
                          priority: "",
                          estimatedTime: "",
                        });
                        set_hideSuggestion(true);
                      }}
                    >
                      X
                    </button>
                    {/* <table className="table">
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
                  </table> */}
                    <div className="card shadow-sm border-0 mt-3">
                      <div className="card-body">
                        <h5 className="fw-bold">{suggestion.title}</h5>

                        <p>{suggestion.description}</p>

                        <div className="d-flex gap-2 flex-wrap">
                          <span className="badge bg-danger">
                            {suggestion.priority}
                          </span>

                          <span className="badge bg-primary">
                            {suggestion.estimatedTime}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* <div className="col d-block d-md-none">
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
                  </div> */}
                  <div className="row ">
                    <div className="col">
                      <button
                        className="btn btn-outline-dark"
                        onClick={(e) => {
                          e.preventDefault();
                          set_view_addtaskform(true);
                          set_addTaskObject({
                            ...addTaskObject,
                            title: suggestion.title,
                            description: suggestion.description,
                            priority: suggestion.priority,
                          });
                        }}
                      >
                        Add this to Task
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="row mt-4">
        <div className="col">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h2 className="fw-bold">Tasks Created</h2>
            <button
              className="btn text-white"
              style={{ background: "#6366F1" }}
              onClick={() => set_view_addtaskform(!view_addtaskform)}
            >
              {view_addtaskform ? "X" : "+ Create Task"}
            </button>
          </div>
          {view_addtaskform && (
            <div className="card border-0 shadow-sm rounded-4 mb-4">
              <div className="card-body p-4">
                {addtask_error && (
                  <p className="text-danger fw-semibold">{addtask_error}</p>
                )}
                <form
                  onSubmit={(e) => addtaskformSubmission(e)}
                  className={`row g-3`}
                >
                  <div className="d-flex flex-column flex-md-row align-items-md-center gap-2">
                    <label htmlFor="add_task_title">Title</label>
                    <input
                      type="text"
                      name=""
                      id="add_task_title"
                      placeholder="Task Title"
                      className="form-control"
                      value={addTaskObject.title}
                      onChange={(e) =>
                        set_addTaskObject({
                          ...addTaskObject,
                          title: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="d-flex flex-column flex-md-row align-items-md-center gap-2">
                    <label htmlFor="add_task_description">Description</label>
                    <textarea
                      name=""
                      id="add_task_description"
                      className="form-control"
                      style={{
                        minHeight: "50px",
                        maxHeight: "80px",
                        scrollbarWidth: "none",
                      }}
                      placeholder="Task Description"
                      value={addTaskObject.description}
                      onChange={(e) => {
                        set_addTaskObject({
                          ...addTaskObject,
                          description: e.target.value,
                        });
                      }}
                    ></textarea>
                  </div>
                  <div className="d-flex flex-column flex-md-row align-items-md-center gap-2">
                    <label htmlFor="add_task_priority">Priority</label>
                    <select
                      name=""
                      id="add_task_priority"
                      className="form-select"
                      value={addTaskObject.priority}
                      onChange={(e) => {
                        set_addTaskObject({
                          ...addTaskObject,
                          priority: e.target.value,
                        });
                      }}
                    >
                      <option value="Default" defaultChecked>
                        Select Priority
                      </option>
                      <option value="LOW">Low</option>
                      <option value="HIGH">High</option>
                    </select>
                  </div>
                  <div className="d-flex flex-column flex-md-row align-items-md-center gap-2">
                    <label htmlFor="add_task_status">Status</label>
                    <select
                      name=""
                      id="add_task_status"
                      className="form-select"
                      value={addTaskObject.status}
                      onChange={(e) => {
                        set_addTaskObject({
                          ...addTaskObject,
                          status: e.target.value,
                        });
                      }}
                    >
                      <option value="Default" defaultChecked>
                        Select Status
                      </option>
                      <option value="TODO">Todo</option>
                      <option value="IN_PROGRESS">In Process</option>
                      <option value="DONE">Done</option>
                    </select>
                  </div>
                  <div className="d-flex flex-column flex-md-row align-items-md-center gap-2">
                    <label htmlFor="add_task_duedate">Due Date</label>
                    <input
                      type="date"
                      className="form-control"
                      id="add_task_duedate"
                      value={addTaskObject.dueDate}
                      onChange={(e) => {
                        set_addTaskObject({
                          ...addTaskObject,
                          dueDate: e.target.value,
                        });
                      }}
                    />
                  </div>
                  <div className="d-flex flex-column flex-md-row align-items-md-center gap-2">
                    <button className="btn btn-outline-dark" type="submit">
                      Add Task
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
          {taskList.length > 0 ? (
            <>
              <div className="d-block d-md-none">
                {taskList.map((task) => (
                  <div
                    key={task.taskid}
                    className="card border-0 shadow-sm rounded-4 mb-3"
                  >
                    <div className="card-body">
                      <div className="d-flex justify-content-between align-items-start">
                        <h5 className="fw-bold mb-0">{task.title}</h5>

                        <span
                          className={`badge ${
                            task.priority === "HIGH"
                              ? "bg-danger"
                              : "bg-success"
                          }`}
                        >
                          {task.priority}
                        </span>
                      </div>

                      <hr />

                      <p className="text-muted">{task.description}</p>

                      <div className="mb-2">
                        <span
                          className={`badge ${
                            task.status === "DONE"
                              ? "bg-success"
                              : task.status === "IN_PROGRESS"
                                ? "bg-primary"
                                : "bg-secondary"
                          }`}
                        >
                          {task.status}
                        </span>
                      </div>

                      <p>
                        Due Date :<strong> {task.dueDate}</strong>
                      </p>

                      <div className="d-flex gap-2">
                        <button
                          className="btn btn-warning btn-sm"
                          onClick={(e) => {
                            e.preventDefault();
                            set_update_taskid(task.taskid);
                            set_task_update_formVisiblity(true);
                          }}
                        >
                          Update
                        </button>

                        <button
                          className="btn btn-danger btn-sm"
                          onClick={(e) => {
                            e.preventDefault();
                            deleteTaskById(task.taskid);
                          }}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="table-responsive d-none d-md-block">
                <table className="table table-hover align-middle">
                  <thead className="table-primary">
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
                    {taskList.map((t, index) => (
                      <tr key={index}>
                        <td>{t.title}</td>

                        <td>{t.description}</td>

                        <td><span className={`badge ${t.priority === "HIGH" ? 'bg-danger' : 'bg-success'}`}>
                              {t.priority}
                          </span></td>

                        <td>
                          <span className={`badge ${t.status  === "DONE" ? 'bg-success' : t.status === "IN_PROGRESS" ? 'bg-primary' : 'bg-secondary'}`}>
                            {t.status}
                          </span>
                        </td>

                        <td>{t.createdat}</td>

                        <td>{t.dueDate}</td>

                        <td>
                          <button
                            className="btn btn-outline-dark btn-sm"
                            onClick={(e) => {
                              e.preventDefault();
                              set_update_taskid(t.taskid);
                              set_task_update_formVisiblity(true);
                            }}
                          >
                            Update
                          </button>
                        </td>

                        <td>
                          <button
                            className="btn btn-dark btn-sm"
                            onClick={(e) => {
                              e.preventDefault();
                              deleteTaskById(t.taskid);
                            }}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          ) : (
            <div className="border border-dark rounded p-5 text-center">
              <h3>No Tasks Created</h3>
            </div>
          )}
        </div>
      </div>
      {task_update_formVisiblity && (
        <div
          className="m-0 d-flex justify-content-center align-items-center"
          style={{
            height: "100vh",
            width: "100%",
            backdropFilter: "blur(2px)",
            position: "fixed",
            top: "0",
            left: "0",
          }}
        >
          <div className="row rounded-3 bg-white shadow-lg ">
            <form
              className="col d-flex flex-column gap-3 justify-content-around p-3"
              onSubmit={(e) => {
                e.preventDefault();
                update_form_submit();
              }}
            >
              <div>
                <button
                  className="btn btn-outline-dark"
                  onClick={(e) => {
                    e.preventDefault();
                    set_update_taskid(-1);
                    set_task_update_formVisiblity(false);
                  }}
                >
                  X
                </button>
              </div>
              <div className="d-flex flex-column flex-md-row align-items-md-center gap-2">
                <label htmlFor="update_task_title">Title</label>
                <input
                  type="text"
                  id="update_task_title"
                  placeholder="Task Title"
                  value={task_update_form.title}
                  onChange={(e) => {
                    set_task_update_form({
                      ...task_update_form,
                      title: e.target.value,
                    });
                  }}
                />
              </div>

              <div className="d-flex flex-column flex-md-row align-items-md-center gap-2">
                <label htmlFor="update_task_description">Description</label>
                <textarea
                  id="update_task_description"
                  placeholder="Task Description"
                  value={task_update_form.description}
                  style={{ scrollbarWidth: "none", maxHeight: "80px" }}
                  onChange={(e) => {
                    set_task_update_form({
                      ...task_update_form,
                      description: e.target.value,
                    });
                  }}
                ></textarea>
              </div>

              <div className="d-flex flex-column flex-md-row align-items-md-center gap-2">
                <label htmlFor="update_task_priority">Priority</label>
                <select
                  id="update_task_priority"
                  value={task_update_form.priority}
                  onChange={(e) => {
                    set_task_update_form({
                      ...task_update_form,
                      priority: e.target.value,
                    });
                  }}
                >
                  <option value="Default">Select Priority</option>
                  <option value="LOW">Low</option>
                  <option value="HIGH">High</option>
                </select>
              </div>

              <div className="d-flex flex-column flex-md-row align-items-md-center gap-2">
                <label htmlFor="update_task_status">Status</label>
                <select
                  id="update_task_status"
                  value={task_update_form.status}
                  onChange={(e) => {
                    set_task_update_form({
                      ...task_update_form,
                      status: e.target.value,
                    });
                  }}
                >
                  <option value="Default">Select Status</option>
                  <option value="TODO">Todo</option>
                  <option value="IN_PROGRESS">In Progress</option>
                  <option value="DONE">Done</option>
                </select>
              </div>

              <div className="d-flex flex-column flex-md-row align-items-md-center gap-2">
                <label htmlFor="update_task_due_date">Due Date</label>
                <input
                  type="date"
                  id="update_task_due_date"
                  value={task_update_form.dueDate}
                  onChange={(e) => {
                    set_task_update_form({
                      ...task_update_form,
                      dueDate: e.target.value,
                    });
                  }}
                />
              </div>

              <div className="d-flex flex-column flex-md-row align-items-md-center gap-2">
                <button className="btn btn-outline-dark" type="submit">
                  Update Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
