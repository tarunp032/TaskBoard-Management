const wrap = (children) => `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<title>TaskBoard Notification</title>
</head>
<body style="margin:0; padding:0; background: linear-gradient(108deg,#f8fafc 60%,#ede9fe 100%); font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
  <div style="max-width:480px; margin:40px auto; background:#fff; border-radius:18px; box-shadow: 0 16px 48px rgba(123, 47, 247, 0.12); padding:32px 28px; color:#3c096c; text-align:center;">
    <h1 style="font-size:28px; font-weight:900; letter-spacing:1.3px; margin-bottom:34px; font-family: 'Segoe UI', sans-serif;">TaskBoard</h1>
    ${children}
    <p style="margin-top: 48px; font-size:14px; color:#9333ea; letter-spacing: 1.2px;">— TaskBoard Team</p>
  </div>
</body>
</html>
`;

exports.otp = ({ name, otp, reason = "Verify your Account", expire = 2 }) =>
  wrap(`
  <h2 style="color:#7b2ff7;font-weight:900;font-size:1.5em;margin-bottom:8px;">${reason}</h2>
  <p style="font-size:17px;margin-top:0;">Hi <b>${name || "User"}</b>,<br>Your OTP is below:</p>
  <div style="margin:32px 0 24px 0;padding:16px 0;text-align:center;background:#ede9fe;border-radius:13px;">
    <span style="font-size:40px;letter-spacing:12px;color:#6d28d9;font-weight:900;">${otp}</span>
    <div style="font-size:12px;color:#6b7280;margin-top:4px;">Expires in ${expire} minutes</div>
  </div>
  <p style="font-size:15px;">Didn't request this? Please ignore.</p>
`);

exports.taskAssigned = ({ assigneeName, assignerName, taskName, deadline }) =>
  wrap(`
  <h2 style="color:#14b8a6;font-weight:900;">🎉 New Task Assigned</h2>
  <p>Hi <b>${assigneeName}</b>, you have been assigned a new task by <span style="color:#7b2ff7;">${assignerName}</span>:</p>
  <div style="background:#fdf4ff;padding:16px 20px;border-radius:11px;margin:18px 0;"><b>Task:</b> ${taskName}<br><b>Deadline:</b> ${deadline}</div>
  <p style="font-size:15px;margin-top:2px;">Check your TaskBoard dashboard for more.</p>
`);

exports.taskUpdated = ({
  assigneeName,
  assignerName,
  taskName,
  deadline,
  status,
}) =>
  wrap(`
  <h2 style="color:#5b21b6; font-weight:900; font-size:2.4em; margin-bottom:20px;">🔄 Task Updated</h2>
  <p style="font-size:1.2em; color:#3c096c;">Hello <b>${assigneeName}</b>,</p>
  <p style="font-size:1em; line-height:1.5; max-width: 440px; color:#5a189a;">
    A task assigned to you by <b style="color:#7b2ff7;">${assignerName}</b> has been updated.
  </p>
  <div style="background:#ede9fe; border-left:6px solid #7b2ff7; margin: 28px 0; padding: 22px 20px; border-radius:16px; color:#4c1d95;">
    <p style="margin: 8px 0;"><b>Task:</b> ${taskName}</p>
    <p style="margin: 8px 0;"><b>Deadline:</b> ${deadline}</p>
    <p style="margin: 8px 0;"><b>Status:</b> <span style="color:${
      status === "completed" ? "#14a44d" : "#facc15"
    }">${status.toUpperCase()}</span></p>
  </div>
  <p style="text-align:center; font-size:1em; color:#6a4c93;">
    Please check your <a href="https://yourapp.com/dashboard" style="color:#9333ea; text-decoration:none;">TaskBoard dashboard</a> for more details.
  </p>
  `);

exports.taskStatus = ({ name, taskName, status }) =>
  wrap(`
  <h2 style="color:#fbbf24;font-weight:900;">${
    status === "completed" ? "✅ Task Completed" : "⏳ Task Pending"
  }</h2>
  <p>Hi <b>${name}</b>,<br>The status of your task <b>${taskName}</b> is now <b style="color:${
    status === "completed" ? "#10b981" : "#fbbf24"
  }">${status.toUpperCase()}</b>.</p>
  `);

exports.subTask = ({ name, parentTask, subTaskTitle, deadline }) =>
  wrap(`
  <h2 style="color:#a78bfa;font-weight:900;">📝 New Sub-task</h2>
  <p>Hi <b>${name}</b>,<br>New sub-task for your task <b style="color:#7b2ff7">${parentTask}</b>:</p>
  <div style="background:#f3e8ff;padding:13px 19px;border-left:6px solid #c4b5fd;border-radius:10px;margin:14px 0;">
    <b>Sub-task:</b> ${subTaskTitle}<br><b>Deadline:</b> ${deadline}
  </div>
  `);

exports.subTaskUpdated = ({
  name,
  parentTask,
  subTaskTitle,
  deadline,
  status,
}) =>
  wrap(`
  <h2 style="color:#0284c7;font-weight:900;">📝 Sub-task Updated</h2>
  <p>Hi <b>${name}</b>,<br>A sub-task in <b>${parentTask}</b> was updated:</p>
  <div style="background:#e0f2fe;padding:12px 16px;border-left:6px solid #38bdf8;border-radius:9px;">
    <b>Sub-task:</b> ${subTaskTitle}<br>
    <b>Deadline:</b> ${deadline}<br>
    <b>Status:</b> <span style="color:${
      status === "completed" ? "#22c55e" : "#fbbf24"
    }">${status}</span>
  </div>
  `);

exports.subTaskStatus = ({ name, parentTask, subTaskTitle, status }) =>
  wrap(`
  <h2 style="color:#b97af7;font-weight:900;">Sub-task Status Updated</h2>
  <p>Hi <b>${name}</b>,<br>The status of sub-task <b>${subTaskTitle}</b> under <b>${parentTask}</b> is now <b style="color:${
    status === "completed" ? "#10b981" : "#fbbf24"
  }">${status.toUpperCase()}</b>.</p>
  `);

exports.passwordChanged = ({ name }) =>
  wrap(`
  <h2 style="color:#22c55e;font-weight:900;">🔒 Password Changed</h2>
  <p>Hi <b>${name}</b>,<br>Your password was changed. If this wasn't you, <a href="mailto:support@yourapp.com" style="color:#ef4444;font-weight:600;">contact support</a> now.</p>
  `);

exports.profileUpdated = ({ name, changes }) =>
  wrap(`
  <h2 style="color:#8b5cf6;font-weight:900;">👤 Profile Updated</h2>
  <p>Hi <b>${name}</b>,<br>Your profile was updated: <u>${changes}</u>.</p>
  <p>If you did not make this change, contact support!</p>
  `);
