const Task = require("../models/taskModel");
const User = require("../models/userModel");
const sendEmail = require("../utils/sendEmail");
const emailTemplates = require("../utils/emailTemplates");

// 1. Create Task
exports.createTask = async (req, res) => {
  try {
    const { taskname, assignTo, deadline, imageUrl } = req.body;
    const assignBy = req.user._id;

    if (!taskname || !assignTo || !deadline) {
      return res
        .status(400)
        .json({
          success: false,
          message: "Please provide taskname, assignTo, and deadline",
        });
    }
    if (assignBy.toString() === assignTo) {
      return res
        .status(403)
        .json({ success: false, message: "Cannot assign task to yourself" });
    }

    const task = await Task.create({
      taskname,
      assignBy,
      assignTo,
      deadline,
      status: "pending",
      imageUrl: imageUrl || null,
    });

    await task.populate("assignTo", "name email");
    await task.populate("assignBy", "name email");

    sendEmail({
      to: task.assignTo.email,
      subject: `New Task Assigned: ${task.taskname}`,
      html: emailTemplates.taskAssigned({
        assigneeName: task.assignTo.name,
        assignerName: task.assignBy.name,
        taskName: task.taskname,
        deadline,
      }),
    });

    res
      .status(201)
      .json({
        success: true,
        message: "Task created successfully",
        data: task,
      });
  } catch (error) {
    console.error("Create task error", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// 2. Get Tasks TO Me
exports.getTasksToMe = async (req, res) => {
  try {
    const { startDate, endDate, status } = req.query;
    const userId = req.user._id;
    const filter = { assignTo: userId };

    if (startDate && isNaN(new Date(startDate))) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid startDate" });
    }
    if (endDate && isNaN(new Date(endDate))) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid endDate" });
    }

    if (startDate || endDate) {
      filter.deadline = {};
      if (startDate) filter.deadline.$gte = new Date(startDate);
      if (endDate) filter.deadline.$lte = new Date(endDate);
    }

    if (status && ["pending", "completed"].includes(status)) {
      filter.status = status;
    }

    const tasks = await Task.find(filter)
      .populate("assignBy", "name email")
      .populate("assignTo", "name email")
      .sort({ deadline: 1 });

    res.json({ success: true, count: tasks.length, data: tasks });
  } catch (error) {
    console.error("Get tasks to me error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// 3. Get Tasks BY Me
exports.getTasksByMe = async (req, res) => {
  try {
    const { startDate, endDate, status } = req.query;
    const userId = req.user._id;
    const filter = { assignBy: userId };

    if (startDate && isNaN(new Date(startDate))) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid startDate" });
    }
    if (endDate && isNaN(new Date(endDate))) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid endDate" });
    }

    if (startDate || endDate) {
      filter.deadline = {};
      if (startDate) filter.deadline.$gte = new Date(startDate);
      if (endDate) filter.deadline.$lte = new Date(endDate);
    }

    if (status && ["pending", "completed"].includes(status)) {
      filter.status = status;
    }

    const tasks = await Task.find(filter)
      .populate("assignTo", "name email")
      .populate("assignBy", "name email")
      .sort({ deadline: 1 });

    res.json({ success: true, count: tasks.length, data: tasks });
  } catch (error) {
    console.error("Get tasks by me error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// 4. Update Task Status
exports.updateTaskStatus = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { status } = req.body;
    const userId = req.user._id;

    if (!["pending", "completed"].includes(status)) {
      return res
        .status(400)
        .json({
          success: false,
          message: "Status must be either pending or completed",
        });
    }

    const task = await Task.findById(taskId)
      .populate("assignTo", "name email")
      .populate("assignBy", "name email");
    if (!task)
      return res
        .status(404)
        .json({ success: false, message: "Task not found" });

    if (task.assignTo._id.toString() !== userId.toString()) {
      return res
        .status(403)
        .json({
          success: false,
          message: "You can only update status of tasks assigned to you",
        });
    }

    task.status = status;
    await task.save();

    await task.populate("assignTo", "name email");
    await task.populate("assignBy", "name email");

    sendEmail({
      to: task.assignTo.email,
      subject: `Task Status Updated: ${task.taskname}`,
      html: emailTemplates.taskStatus({
        name: task.assignTo.name,
        taskName: task.taskname,
        status,
      }),
    });

    res.json({
      success: true,
      message: `Task marked as ${status}`,
      data: task,
    });
  } catch (error) {
    console.error("Update task status error", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// 5. Update Task (Edit)
exports.updateTask = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { taskname, deadline, status } = req.body;
    const userId = req.user._id;

    const task = await Task.findById(taskId)
      .populate("assignTo", "name email")
      .populate("assignBy", "name email");
    if (!task)
      return res
        .status(404)
        .json({ success: false, message: "Task not found" });

    if (task.assignBy._id.toString() !== userId.toString()) {
      return res
        .status(403)
        .json({
          success: false,
          message: "You can only edit tasks you assigned",
        });
    }

    if (taskname) task.taskname = taskname;
    if (deadline) {
      const parsedDeadline = new Date(deadline);
      if (isNaN(parsedDeadline)) {
        return res
          .status(400)
          .json({ success: false, message: "Invalid deadline date" });
      }
      task.deadline = parsedDeadline;
    }
    if (status && ["pending", "completed"].includes(status))
      task.status = status;

    await task.save();

    await task.populate("assignTo", "name email");
    await task.populate("assignBy", "name email");

    sendEmail({
      to: task.assignTo.email,
      subject: `Task Updated: ${task.taskname}`,
      html: emailTemplates.taskUpdated({
        assigneeName: task.assignTo.name,
        assignerName: task.assignBy.name,
        taskName: task.taskname,
        deadline: task.deadline
          ? new Date(task.deadline).toLocaleDateString()
          : "",
        status: task.status,
      }),
    });

    res.json({
      success: true,
      message: "Task updated successfully",
      data: task,
    });
  } catch (error) {
    console.error("Update task error", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// 6. Delete Task (No email)
exports.deleteTask = async (req, res) => {
  try {
    const { taskId } = req.params;
    const userId = req.user._id;
    const task = await Task.findById(taskId);
    if (!task)
      return res
        .status(404)
        .json({ success: false, message: "Task not found" });

    const isCreator = task.assignBy.toString() === userId.toString();
    const isAssignee = task.assignTo.toString() === userId.toString();

    if (!isCreator && !isAssignee) {
      return res
        .status(403)
        .json({
          success: false,
          message: "You can only delete tasks you created or are assigned to",
        });
    }

    await Task.findByIdAndDelete(taskId);

    res.json({ success: true, message: "Task deleted successfully" });
  } catch (error) {
    console.error("Delete task error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// 7. Get Dashboard Stats (no email)
exports.getDashboardStats = async (req, res) => {
  try {
    const userId = req.user._id;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tasksToMeTotal = await Task.countDocuments({ assignTo: userId });
    const tasksToMePending = await Task.countDocuments({
      assignTo: userId,
      status: "pending",
    });
    const tasksToMeCompleted = await Task.countDocuments({
      assignTo: userId,
      status: "completed",
    });
    const tasksToMeOverdue = await Task.countDocuments({
      assignTo: userId,
      status: "pending",
      deadline: { $lt: today },
    });

    const tasksByMeTotal = await Task.countDocuments({ assignBy: userId });
    const tasksByMePending = await Task.countDocuments({
      assignBy: userId,
      status: "pending",
    });
    const tasksByMeCompleted = await Task.countDocuments({
      assignBy: userId,
      status: "completed",
    });

    res.json({
      success: true,
      data: {
        tasksToMe: {
          total: tasksToMeTotal,
          pending: tasksToMePending,
          completed: tasksToMeCompleted,
          overdue: tasksToMeOverdue,
        },
        tasksByMe: {
          total: tasksByMeTotal,
          pending: tasksByMePending,
          completed: tasksByMeCompleted,
        },
      },
    });
  } catch (error) {
    console.error("Get dashboard stats error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// 8. Reassign a task to a new user
exports.reassignTask = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { assignTo } = req.body;
    const userId = req.user._id;

    if (!assignTo)
      return res
        .status(400)
        .json({ success: false, message: "assignTo is required" });

    const task = await Task.findById(taskId)
      .populate("assignBy", "name email")
      .populate("assignTo", "name email");
    if (!task)
      return res
        .status(404)
        .json({ success: false, message: "Task not found" });

    if (task.assignBy._id.toString() !== userId.toString()) {
      return res
        .status(403)
        .json({ success: false, message: "Only task creator can reassign" });
    }
    if (assignTo === userId.toString()) {
      return res
        .status(403)
        .json({ success: false, message: "Cannot assign task to yourself" });
    }

    const newUser = await User.findById(assignTo);
    if (!newUser)
      return res
        .status(404)
        .json({ success: false, message: "Assignee user not found" });

    task.assignTo = newUser._id;
    task.status = "pending";
    await task.save();
    await task.populate("assignTo", "name email");
    await task.populate("assignBy", "name email");

    sendEmail({
      to: newUser.email,
      subject: `You got a new Task: ${task.taskname}`,
      html: emailTemplates.taskAssigned({
        assigneeName: newUser.name,
        assignerName: task.assignBy.name,
        taskName: task.taskname,
        deadline: task.deadline
          ? new Date(task.deadline).toLocaleDateString()
          : "",
      }),
    });

    res.json({
      success: true,
      message: "Task reassigned successfully",
      data: task,
    });
  } catch (error) {
    console.error("Reassign task error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};
