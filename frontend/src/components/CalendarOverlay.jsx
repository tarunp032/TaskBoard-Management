// CalendarOverlay.jsx

import React, { useState } from "react";
import TaskCard from "../components/TaskCard"; // import here to render tasks for date

// Helpers
function getMonthGrid(year, month) {
  const firstDate = new Date(year, month, 1);
  const lastDate = new Date(year, month + 1, 0);
  const daysInMonth = lastDate.getDate();
  const grid = [];
  let week = [];
  let weekday = firstDate.getDay();
  for (let i = 0; i < weekday; i++) week.push(null);
  for (let day = 1; day <= daysInMonth; day++) {
    week.push(day);
    if (week.length === 7 || day === daysInMonth) {
      grid.push(week);
      week = [];
    }
  }
  while (week.length && week.length < 7) week.push(null);
  if (week.length) grid.push(week);
  return grid;
}

const monthsList = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];
const dateToISO = (y, m, d) => `${y}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
const todayISO = new Date().toISOString().split("T")[0];

function CalendarOverlay({ open, onClose, tasksByDate }) {
  const now = new Date();
  const [viewMonth, setViewMonth] = useState(now.getMonth());
  const [viewYear, setViewYear] = useState(now.getFullYear());
  const [dateModal, setDateModal] = useState(null);  // For the clicked date on calendar
  const grid = getMonthGrid(viewYear, viewMonth);

  // Dot coloring logic
  function getDotColor(dateStr) {
    const tasks = tasksByDate[dateStr];
    if (!tasks || tasks.length === 0) return null;
    const isDue = tasks.some(
      (task) =>
        task.status === "pending" && new Date(task.deadline) < new Date(todayISO)
    );
    if (isDue) return "#fb2d3b";
    const isPending = tasks.some((task) => task.status === "pending");
    if (isPending) return "#fbbf24";
    return "#10b981";
  }

  function handleMonthChange(e) { setViewMonth(Number(e.target.value)); }
  function handleYearChange(e) {
    let val = Number(e.target.value);
    if (val >= 2000 && val <= 2100) setViewYear(val);
  }

  return (
    <div
      className="calendar-overlay-modal"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        zIndex: 99998,
        background: "rgba(42,14,104,0.18)",
        width: "100vw",
        height: "100vh",
        display: open ? "flex" : "none",
        alignItems: "center",
        justifyContent: "center",
      }}
      onClick={onClose}
    >
      <div
        className="calendar-modal-panel"
        style={{
          background: "#fff",
          borderRadius: 24,
          maxWidth: "680px",
          minWidth: "580px",
          width: "92vw",
          padding: "38px 40px 28px 40px",
          boxShadow: "0 30px 44px #9276ff2a",
          border: "2.4px solid #ece9fa",
          overflow: "visible",
          position: "relative",
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Tasks for date (if clicked) */}
        {dateModal && (
          <div
            style={{
              position: "absolute",
              left: "50%",
              top: "18px",
              transform: "translateX(-50%)",
              background: "#fff",
              boxShadow: "0 12px 40px #a78bfa38",
              border: "2px solid #ede9fe",
              borderRadius: 18,
              padding: "22px 32px",
              minWidth: 360,
              maxWidth: 404,
              width: "90%",
              zIndex: 2,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
              <h3 style={{ margin: 0, fontWeight: 800, color: "#b97af7", fontSize: 22 }}>
                Tasks on {dateModal}
              </h3>
              <button
                onClick={() => setDateModal(null)}
                style={{
                  background: "none",
                  border: "none",
                  fontSize: 22,
                  color: "#a78bfa",
                  fontWeight: 800,
                  cursor: "pointer",
                  marginLeft: 10,
                }}
                title="Close"
              >✕</button>
            </div>
            {tasksByDate[dateModal]?.length > 0 ? (
              tasksByDate[dateModal].map((task) => (
                <TaskCard key={task._id} task={task} />
              ))
            ) : (
              <p style={{ textAlign: "center", color: "#868db0" }}>No tasks for this date</p>
            )}
          </div>
        )}

        {/* Calendar header */}
        <div style={{
          display: "flex", justifyContent: "center", alignItems: "center", marginBottom: 28, gap: "22px"
        }}>
          <button
            style={{
              fontSize: 26, background: "none", border: "none", cursor: "pointer",
              color: "#7b2ff7", padding: "2px 8px", borderRadius: "8px",
            }}
            onClick={() => {
              if (viewMonth === 0) {
                setViewMonth(11); setViewYear(viewYear - 1);
              } else setViewMonth(viewMonth - 1);
            }}
            aria-label="Prev Month"
          >{"‹"}</button>
          <select
            value={viewMonth}
            onChange={handleMonthChange}
            style={{
              fontSize: "19px", fontWeight: 600, background: "#f3f3fb",
              borderRadius: "10px", padding: "6px 16px", color: "#9f67ff",
              border: "1.5px solid #e6e6f3", outline: "none"
            }}
          >
            {monthsList.map((m, i) => (
              <option value={i} key={m}>{m}</option>
            ))}
          </select>
          <input
            type="number"
            value={viewYear}
            onChange={handleYearChange}
            min="2000"
            max="2100"
            style={{
              width: "95px", fontWeight: 600, fontSize: "19px",
              background: "#f3f3fb", borderRadius: "10px", padding: "6px 10px",
              color: "#7b2ff7", border: "1.5px solid #e6e6f3", outline: "none",
              textAlign: "center", letterSpacing: "1px"
            }}
            inputMode="numeric"
            maxLength={4}
          />
          <button
            style={{
              fontSize: 26, background: "none", border: "none", cursor: "pointer",
              color: "#7b2ff7", padding: "2px 8px", borderRadius: "8px",
            }}
            onClick={() => {
              if (viewMonth === 11) {
                setViewMonth(0); setViewYear(viewYear + 1);
              } else setViewMonth(viewMonth + 1);
            }}
            aria-label="Next Month"
          >{"›"}</button>
        </div>
        {/* Grid */}
        <table
          style={{
            width: "100%",
            borderSpacing: 0,
            marginBottom: 7,
            tableLayout: "fixed"
          }}
        >
          <thead>
            <tr>
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(d => (
                <th key={d} style={{
                  fontWeight: 700, color: "#b294f9", fontSize: "18px",
                  paddingBottom: "13px", letterSpacing: ".05em", textAlign: "center"
                }}>{d}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {grid.map((week, i) => (
              <tr key={i}>
                {week.map((day, j) => {
                  let isToday = day && dateToISO(viewYear, viewMonth, day) === todayISO;
                  let dayISO = day ? dateToISO(viewYear, viewMonth, day) : null;
                  let dotColor = dayISO ? getDotColor(dayISO) : null;
                  return (
                    <td key={j} style={{ padding: "3px" }}>
                      {day ? (
                        <div
                          style={{
                            cursor: "pointer",
                            minWidth: "54px",
                            height: "54px",
                            textAlign: "center",
                            fontWeight: 600,
                            fontSize: "19px",
                            color: isToday ? "#fff" : "#6e37cc",
                            borderRadius: "14px",
                            background: isToday
                              ? "linear-gradient(135deg,#7b2ff7 70%,#b095ff 140%)"
                              : "#f6f6fa",
                            margin: "2px auto",
                            boxShadow: isToday ? "0 3px 16px #a78bfa72" : "0 2px 9px #e7d4fd23",
                            position: "relative",
                            transition: "background .18s",
                          }}
                          onClick={() => setDateModal(dayISO)}
                        >
                          <span>{day}</span>
                          {dotColor && (
                            <span
                              style={{
                                display: "inline-block", width: "13px",
                                height: "13px", background: dotColor, borderRadius: "100%",
                                border: "2px solid #fff",
                                position: "absolute", top: "54%", left: "60%",
                                transform: "translate(-50%,-10%)",
                                boxShadow: "0 2px 7px #44eeca13"
                              }}
                            />
                          )}
                        </div>
                      ) : ""}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
        {/* Legend */}
        <div style={{
          display: "flex", alignItems: "center", gap: "18px", margin: "12px 0 20px 0"
        }}>
          <span style={{display: "flex", alignItems: "center"}}><span style={{
              width: 12, height: 12, background: "#fbbf24", borderRadius: "100%", display: "inline-block",
              marginRight: 6, border: "2px solid #fff", boxShadow: "0 2px 5px #fbbf2442"
          }}/>Pending</span>
          <span style={{display: "flex", alignItems: "center"}}><span style={{
              width: 12, height: 12, background: "#10b981", borderRadius: "100%", display: "inline-block",
              marginRight: 6, border: "2px solid #fff", boxShadow: "0 2px 5px #10b98160"
          }}/>Completed</span>
          <span style={{display: "flex", alignItems: "center"}}><span style={{
              width: 12, height: 12, background: "#fb2d3b", borderRadius: "100%", display: "inline-block",
              marginRight: 6, border: "2px solid #fff", boxShadow: "0 2px 5px #fb2d3b60"
          }}/>Due/Overdue</span>
        </div>
        <div style={{ textAlign: "right", marginTop: 19 }}>
          <button
            onClick={onClose}
            style={{
              padding: "11px 32px",
              fontWeight: 700,
              background: "#ede9fe",
              color: "#7b2ff7",
              borderRadius: 14,
              border: "0",
              cursor: "pointer",
              fontSize: "18px",
              boxShadow: "0 2px 8px #dfccfd2a",
            }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default CalendarOverlay;
