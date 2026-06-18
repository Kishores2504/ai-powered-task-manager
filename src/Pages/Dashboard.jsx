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
  className="container-fluid py-4"
  style={{
    minHeight: "100vh",
    background: "linear-gradient(135deg , #f8fafc 0%, #eef2ff 100%)",
  }}
>
  
  <div className="row align-items-center p-4 rounded-4 shadow-sm bg-white mb-4 border border-light-subtle">
    <div className="col">
      <h2 className="fw-bold mb-1 text-dark tracking-tight">Welcome Back</h2>
      <p className="text-muted mb-0 small d-flex align-items-center gap-1">
        <span className="p-1 rounded-circle bg-success d-inline-block animate__ping" style={{ width: "6px", height: "6px" }}></span>
        Manage your tasks intelligently with AI assist
      </p>
    </div>
    <div className="col-auto">
      <button
        className="btn px-4 py-2 rounded-3 fw-medium shadow-sm transition-all text-white"
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

  {/* AI Suggestion Panel */}
  <div className="row mt-4">
    <div className="col">
      <div className="card border-0 shadow-sm rounded-4 overflow-hidden" style={{ background: "linear-gradient(180deg, #ffffff 0%, #fafafa 100%)" }}>
        <div className="card-body p-4 p-md-5">
          <div className="d-flex align-items-center gap-2 mb-3">
            <h4 className="fw-bold mb-0 text-dark">AI Task Suggestion</h4>
          </div>
          
          <div className="row g-3 align-items-center">
            <div className="col-md-9">
              <input
                type="text"
                className="form-control py-2.5 px-3 border border-light-subtle rounded-3"
                placeholder="What project feature are you planning? (e.g., Secure Route Testing)"
                value={suggestion.title}
                onChange={(e) =>
                  set_suggestion({ ...suggestion, title: e.target.value })
                }
              />
            </div>
            <div className="col-md-3">
              <button
                className="btn text-white w-100 py-2.5 rounded-3 fw-medium shadow-sm"
                onClick={(e) => initializeAirequest(e)}
                style={{ background: "#6366F1" }}
              >
                Get Suggestion
              </button>
            </div>
          </div>

          {loading && (
            <div className="mt-4 d-flex align-items-center gap-2 text-indigo">
              <div className="spinner-border spinner-border-sm text-primary" role="status"></div>
              <span className="small text-muted fw-medium">AI is generating architecture parameters...</span>
            </div>
          )}

          {hideSuggesion === false && (
            <div className="mt-4 p-4 rounded-4 border position-relative" style={{ backgroundColor: "#f8fafc", borderColor: "#e2e8f0" }}>
              <button
                className="btn btn-sm btn-link text-muted position-absolute top-0 end-0 m-3 text-decoration-none fw-bold"
                style={{ fontSize: "1.1rem" }}
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
                ✕
              </button>

              <div className="pe-4">
                <span className="badge mb-2 bg-indigo-subtle px-2.5 py-1.5 rounded-2 text-indigo fw-semibold text-uppercase tracking-wider" style={{ background: "#e0e7ff", color: "#4338ca", fontSize: "0.75rem" }}>
                  Recommended Action
                </span>
                <h5 className="fw-bold text-dark mb-2">{suggestion.title}</h5>
                <p className="text-secondary small mb-3 lh-base">{suggestion.description}</p>

                <div className="d-flex gap-2 flex-wrap mb-3">
                  <span className={`badge px-2.5 py-1.5 rounded-pill ${suggestion.priority === "HIGH" ? 'bg-danger-subtle text-danger' : 'bg-success-subtle text-success'}`} style={{ fontSize: "0.8rem" }}>
                    Priority: {suggestion.priority}
                  </span>
                  <span className="badge bg-primary-subtle text-primary px-2.5 py-1.5 rounded-pill" style={{ fontSize: "0.8rem" }}>
                    Estimated Time: {suggestion.estimatedTime}
                  </span>
                </div>

                <button
                  className="btn btn-sm text-white px-3 py-2 rounded-3 fw-medium shadow-sm"
                  style={{ background: "#4f46e5" }}
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
                  Import parameters to workspace
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  </div>

  <div className="row mt-5">
    <div className="col">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3 className="fw-bold text-dark m-0 tracking-tight">Active Matrix Space</h3>
        <button
          className="btn text-white px-3 py-2 rounded-3 fw-medium shadow-sm d-flex align-items-center gap-1"
          style={{ background: view_addtaskform ? "#64748b" : "#6366F1" }}
          onClick={() => set_view_addtaskform(!view_addtaskform)}
        >
          {view_addtaskform ? "✕ Collapse" : "＋ Create Task"}
        </button>
      </div>

      {view_addtaskform && (
        <div className="card border-0 shadow-sm rounded-4 mb-4 border-start border-4" style={{ borderLeftColor: "#6366F1 !important" }}>
          <div className="card-body p-4">
            <h5 className="fw-bold mb-3 text-dark">Configure Workspace Blueprint</h5>
            {addtask_error && (
              <div className="alert alert-danger py-2 px-3 small rounded-3 border-0 mb-3" style={{ background: "#fee2e2", color: "#991b1b" }}>
               {addtask_error}
              </div>
            )}
            <form onSubmit={(e) => addtaskformSubmission(e)} className="row g-3">
              <div className="col-md-6 d-flex flex-column gap-1">
                <label htmlFor="add_task_title" className="small fw-semibold text-muted">Blueprint Name</label>
                <input
                  type="text"
                  id="add_task_title"
                  placeholder="Task title details..."
                  className="form-control py-2 border-light-subtle rounded-3"
                  value={addTaskObject.title}
                  onChange={(e) =>
                    set_addTaskObject({ ...addTaskObject, title: e.target.value })
                  }
                />
              </div>

              <div className="col-md-6 d-flex flex-column gap-1">
                <label htmlFor="add_task_priority" className="small fw-semibold text-muted">Impact Priority</label>
                <select
                  id="add_task_priority"
                  className="form-select py-2 border-light-subtle rounded-3"
                  value={addTaskObject.priority}
                  onChange={(e) => set_addTaskObject({ ...addTaskObject, priority: e.target.value })}
                >
                  <option value="Default">Select Priority Level</option>
                  <option value="LOW">Low</option>
                  <option value="HIGH">High</option>
                </select>
              </div>

              <div className="col-md-4 d-flex flex-column gap-1">
                <label htmlFor="add_task_status" className="small fw-semibold text-muted">Task Routing Status</label>
                <select
                  id="add_task_status"
                  className="form-select py-2 border-light-subtle rounded-3"
                  value={addTaskObject.status}
                  onChange={(e) => set_addTaskObject({ ...addTaskObject, status: e.target.value })}
                >
                  <option value="Default">Select Route Status</option>
                  <option value="TODO">Todo</option>
                  <option value="IN_PROGRESS">In Process</option>
                  <option value="DONE">Done</option>
                </select>
              </div>

              <div className="col-md-4 d-flex flex-column gap-1">
                <label htmlFor="add_task_duedate" className="small fw-semibold text-muted">Target Deadlines</label>
                <input
                  type="date"
                  className="form-control py-2 border-light-subtle rounded-3"
                  id="add_task_duedate"
                  value={addTaskObject.dueDate}
                  onChange={(e) => set_addTaskObject({ ...addTaskObject, dueDate: e.target.value })}
                />
              </div>

              <div className="col-md-12 d-flex flex-column gap-1">
                <label htmlFor="add_task_description" className="small fw-semibold text-muted">Architectural Description</label>
                <textarea
                  id="add_task_description"
                  className="form-control border-light-subtle rounded-3 py-2"
                  style={{ minHeight: "60px", maxHeight: "100px" }}
                  placeholder="Provide explicit operational parameters of this task module..."
                  value={addTaskObject.description}
                  onChange={(e) => set_addTaskObject({ ...addTaskObject, description: e.target.value })}
                ></textarea>
              </div>

              <div className="col-12 mt-3">
                <button className="btn text-white px-4 py-2 rounded-3 shadow-sm fw-medium" type="submit" style={{ background: "#4f46e5" }}>
                  Commit Task
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
              <div key={task.taskid} className="card border-0 shadow-sm rounded-4 mb-3 border-start border-3" style={{ borderLeftColor: task.priority === "HIGH" ? "#ef4444" : "#22c55e" }}>
                <div className="card-body p-4">
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <h5 className="fw-bold mb-0 text-dark">{task.title}</h5>
                    <span className={`badge px-2.5 py-1 ${task.priority === "HIGH" ? "bg-danger-subtle text-danger" : "bg-success-subtle text-success"}`}>
                      {task.priority}
                    </span>
                  </div>
                  <p className="text-secondary small mb-3 lh-base">{task.description}</p>
                  
                  <div className="d-flex align-items-center justify-content-between border-top pt-3 mt-2">
                    <span className={`badge rounded-pill px-2.5 py-1.5 ${task.status === "DONE" ? "bg-success text-white" : task.status === "IN_PROGRESS" ? "bg-primary text-white" : "bg-secondary text-white"}`}>
                      {task.status}
                    </span>
                    <span className="small text-muted">Due: <strong className="text-dark">{task.dueDate}</strong></span>
                  </div>

                  <div className="d-flex gap-2 mt-3 justify-content-end">
                    <button
                      className="btn btn-light btn-sm px-3 border"
                      onClick={(e) => {
                        e.preventDefault();
                        set_update_taskid(task.taskid);
                        set_task_update_formVisiblity(true);
                      }}
                    >
                      Modify
                    </button>
                    <button
                      className="btn btn-danger btn-sm px-3"
                      onClick={(e) => {
                        e.preventDefault();
                        deleteTaskById(task.taskid);
                      }}
                    >
                      Purge
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="table-responsive d-none d-md-block card border-0 shadow-sm rounded-4 p-2 bg-white">
            <table className="table table-hover align-middle mb-0">
              <thead>
                <tr className="text-muted border-bottom" style={{ fontSize: "0.875rem" }}>
                  <th className="py-3 ps-3">Scope Blueprint</th>
                  <th className="py-3">Priority Matrix</th>
                  <th className="py-3">Current Pipeline</th>
                  <th className="py-3">Timestamp</th>
                  <th className="py-3">Deadline</th>
                  <th className="py-3 text-end pe-4">Controls</th>
                </tr>
              </thead>
              <tbody>
                {taskList.map((t, index) => (
                  <tr key={index} className="align-middle">
                    <td className="py-3.5 ps-3">
                      <div className="fw-bold text-dark">{t.title}</div>
                      <div className="text-muted small text-truncate" style={{ maxWidth: "280px" }}>{t.description}</div>
                    </td>
                    <td>
                      <span className={`badge px-2.5 py-1.5 rounded-2 ${t.priority === "HIGH" ? 'bg-danger-subtle text-danger' : 'bg-success-subtle text-success'}`}>
                        {t.priority}
                      </span>
                    </td>
                    <td>
                      <span className={`badge px-2.5 py-1.5 rounded-pill ${t.status === "DONE" ? 'bg-success text-white' : t.status === "IN_PROGRESS" ? 'bg-primary text-white' : 'bg-secondary text-white'}`}>
                        {t.status}
                      </span>
                    </td>
                    <td className="text-secondary small">{t.createdat}</td>
                    <td className="text-dark fw-medium small">{t.dueDate}</td>
                    <td className="text-end pe-4">
                      <div className="d-inline-flex gap-1">
                        <button
                          className="btn btn-sm btn-outline-secondary border-light-subtle rounded-2 px-2.5"
                          onClick={(e) => {
                            e.preventDefault();
                            set_update_taskid(t.taskid);
                            set_task_update_formVisiblity(true);
                          }}
                        >
                          Edit
                        </button>
                        <button
                          className="btn btn-sm btn-light border-0 text-danger rounded-2 px-2.5"
                          onClick={(e) => {
                            e.preventDefault();
                            deleteTaskById(t.taskid);
                          }}
                        >
                          Remove
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      ) : (
        <div className="card border-0 shadow-sm rounded-4 text-center p-5 bg-white">
          <h4 className="fw-bold text-dark mb-1">Matrix Pipeline Empty</h4>
          <p className="text-muted small mb-0">No synchronized task elements exist within this deployment yet.</p>
        </div>
      )}
    </div>
  </div>
  {task_update_formVisiblity && (
    <div
      className="m-0 d-flex justify-content-center align-items-center animate__animated animate__fadeIn"
      style={{
        height: "100vh",
        width: "100%",
        backgroundColor: "rgba(15, 23, 42, 0.4)",
        backdropFilter: "blur(6px)",
        position: "fixed",
        top: "0",
        left: "0",
        zIndex: "1060"
      }}
    >
      <div className="card border-0 shadow-2xl rounded-4 w-100 m-3 overflow-hidden" style={{ maxWidth: "520px" }}>
        <div className="p-3.5 d-flex justify-content-between align-items-center text-white" style={{ background: "linear-gradient(135deg, #6366F1, #4f46e5)" }}>
          <h5 className="fw-bold mb-0">Update Module Parameters</h5>
          <button
            className="btn p-0 text-white border-0 fw-semibold"
            style={{ fontSize: "1.2rem", opacity: "0.85" }}
            onClick={(e) => {
              e.preventDefault();
              set_update_taskid(-1);
              set_task_update_formVisiblity(false);
            }}
          >
            ✕
          </button>
        </div>

        <form
          className="card-body p-4 d-flex flex-column gap-3 bg-white"
          onSubmit={(e) => {
            e.preventDefault();
            update_form_submit();
          }}
        >
          <div className="d-flex flex-column gap-1">
            <label htmlFor="update_task_title" className="small fw-semibold text-muted">Scope Title</label>
            <input
              type="text"
              id="update_task_title"
              className="form-control border-light-subtle py-2 rounded-3"
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

          <div className="d-flex flex-column gap-1">
            <label htmlFor="update_task_priority" className="small fw-semibold text-muted">Priority Matrix</label>
            <select
              id="update_task_priority"
              className="form-select border-light-subtle py-2 rounded-3"
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

          <div className="d-flex flex-column gap-1">
            <label htmlFor="update_task_status" className="small fw-semibold text-muted">Pipeline Routing Status</label>
            <select
              id="update_task_status"
              className="form-select border-light-subtle py-2 rounded-3"
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

          <div className="d-flex flex-column gap-1">
            <label htmlFor="update_task_due_date" className="small fw-semibold text-muted">Deadline Target</label>
            <input
              type="date"
              id="update_task_due_date"
              className="form-control border-light-subtle py-2 rounded-3"
              value={task_update_form.dueDate}
              onChange={(e) => {
                set_task_update_form({
                  ...task_update_form,
                  dueDate: e.target.value,
                });
              }}
            />
          </div>

          <div className="d-flex flex-column gap-1">
            <label htmlFor="update_task_description" className="small fw-semibold text-muted">Module Details</label>
            <textarea
              id="update_task_description"
              className="form-control border-light-subtle rounded-3 py-2"
              placeholder="Task Description"
              value={task_update_form.description}
              style={{ scrollbarWidth: "none", maxHeight: "100px", minHeight: "60px" }}
              onChange={(e) => {
                set_task_update_form({
                  ...task_update_form,
                  description: e.target.value,
                });
              }}
            ></textarea>
          </div>

          <div className="d-flex justify-content-end gap-2 mt-2 pt-2 border-top">
            <button 
              type="button" 
              className="btn btn-light border px-4 rounded-3"
              onClick={() => {
                set_update_taskid(-1);
                set_task_update_formVisiblity(false);
              }}
            >
              Cancel
            </button>
            <button className="btn text-white px-4 rounded-3 fw-medium shadow-sm" type="submit" style={{ background: "#6366F1" }}>
              Save Modifications
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
