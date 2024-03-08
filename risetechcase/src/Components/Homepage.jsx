import React, { useState, useRef } from "react";
import "./Homepage.css"; // Import the CSS file
import pic1 from "../assets/pic1.png";
import deleteIcon from "../assets/delete.png";
import editIcon from "../assets/edit.png";

// Locale Storage save load
export const saveErrandsToLocalStorage = (errands) => {
  localStorage.setItem("errands", JSON.stringify(errands));
};

export const loadErrandsFromLocalStorage = () => {
  const errands = localStorage.getItem("errands");
  return errands ? JSON.parse(errands) : [];
};

function Homepage() {
  const [errands, setErrands] = useState(loadErrandsFromLocalStorage());
  const [newErrand, setNewErrand] = useState("");
  const [priority, setPriority] = useState("Regular");
  const [sortBy, setSortBy] = useState("None");
  const [editingIndex, setEditingIndex] = useState(-1);
  const [editValue, setEditValue] = useState("");
  const [editPriority, setEditPriority] = useState("Regular");

  const [filterBy, setFilterBy] = useState("All");

  // Adding errand
  const addErrand = () => {
    if (!newErrand) return;
    const updatedErrands = [...errands, { name: newErrand, priority }];
    setErrands(updatedErrands);
    saveErrandsToLocalStorage(updatedErrands);
    setNewErrand("");
    setPriority("Regular");
  };

  // sorting errands
  const sortedErrands = [...errands].sort((a, b) => {
    if (sortBy === "Priority") {
      // Sort by priority
      if (a.priority === "Urgent" && b.priority !== "Urgent") {
        return -1;
      } else if (a.priority !== "Urgent" && b.priority === "Urgent") {
        return 1;
      } else {
        return a.priority.localeCompare(b.priority);
      }
    } else if (sortBy === "Name") {
      // Sort by name
      return a.name.localeCompare(b.name);
    }
    // No sorting
    return 0;
  });

  // Filtering
  const filteredErrands =
    filterBy === "All"
      ? sortedErrands
      : sortedErrands.filter((errand) => errand.priority === "Urgent");

  // Delete Errands
  const deleteErrand = (index) => {
    if (window.confirm("Ar you sure you want to delete?")) {
      const updatedErrands = [...errands];
      updatedErrands.splice(index, 1);
      setErrands(updatedErrands);
      saveErrandsToLocalStorage(updatedErrands);
    }
  };
  // Edit Errands
  const editErrand = (index) => {
    setEditingIndex(index);
    setEditValue(errands[index].name);
    setEditPriority(errands[index].priority);
  };

  const saveEditedErrand = () => {
    const updatedErrands = [...errands];
    updatedErrands[editingIndex] = { name: editValue, priority: editPriority };
    setErrands(updatedErrands);
    saveErrandsToLocalStorage(updatedErrands);
    setEditingIndex(-1);
  };

  const cancelEdit = () => {
    setEditingIndex(-1);
  };

  return (
    <div>
      <h1>
        <img
          src={pic1}
          alt="pic1"
          style={{
            width: "75px",
            height: "75px",
            marginLeft: "1px",
            marginTop: "10px",
          }}
        />
      </h1>
      <h1>Create a Job</h1>
      <div className="inputfield">
        <input
          type="text"
          placeholder="Enter errand"
          value={newErrand}
          onChange={(e) => setNewErrand(e.target.value)}
        />

        <select value={priority} onChange={(e) => setPriority(e.target.value)}>
          <option value="Urgent">Urgent</option>
          <option value="Regular">Regular</option>
          <option value="Trivial">Trivial</option>
        </select>
        <button onClick={addErrand}>
          <em>
            <b>Add Errand</b>
          </em>
        </button>
      </div>
      <div className="sort">
        Sort by:{" "}
        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
          <option value="None">By Date Added</option>
          <option value="Priority">By Priority</option>
          <option value="Name">By Name</option>
        </select>
      </div>
      <div className="filter">
        Filter by:{" "}
        <select value={filterBy} onChange={(e) => setFilterBy(e.target.value)}>
          <option value="All">All</option>
          <option value="Urgent">Urgent</option>
        </select>
      </div>
      <ul>
        <li className="header">
          <div>Jobs</div>
          <div>Priority</div>
          <div>Actions</div>
        </li>
        {filteredErrands.map((errand, index) => (
          <li key={index}>
            {editingIndex === index ? (
              <>
                <input
                  type="text"
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                />
                <select
                  value={editPriority}
                  onChange={(e) => setEditPriority(e.target.value)}
                >
                  <option color="Red" value="Urgent">
                    Urgent
                  </option>
                  <option value="Regular">Regular</option>
                  <option value="Trivial">Trivial</option>
                </select>
                <button onClick={saveEditedErrand}>Save</button>
                <button onClick={cancelEdit}>Cancel</button>
              </>
            ) : (
              <>
                {errand.name}
                <div
                  className={`epriority epriority-${errand.priority.toLowerCase()}`}
                >
                  {errand.priority}
                </div>
                <div>
                  <button onClick={() => editErrand(index)}>
                    <img
                      src={editIcon}
                      alt="Edit Icon"
                      style={{ width: "20px", marginRight: "10px" }}
                    />
                  </button>
                  <button onClick={() => deleteErrand(index)}>
                    <img
                      src={deleteIcon}
                      alt="Delete Icon"
                      style={{ width: "20px", marginRight: "10px" }}
                    />
                  </button>
                </div>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Homepage;
