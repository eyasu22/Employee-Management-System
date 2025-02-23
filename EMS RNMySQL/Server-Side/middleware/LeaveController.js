let leaveRequests = [
    { id: 1, employeeName: "John Doe", reason: "Vacation", startDate: "2024-02-15", endDate: "2024-02-20", status: "Pending" },
    { id: 2, employeeName: "Jane Smith", reason: "Medical", startDate: "2024-02-10", endDate: "2024-02-12", status: "Pending" },
  ];
  
  // **GET all leave requests**
  export const getLeaveRequests = (req, res) => {
    res.json(leaveRequests);
  };
  
  // **Approve a leave request**
  export const approveLeave = (req, res) => {
    const leaveId = parseInt(req.params.id);
    leaveRequests = leaveRequests.map((leave) =>
      leave.id === leaveId ? { ...leave, status: "Approved" } : leave
    );
    res.json({ message: "Leave approved!" });
  };
  
  // **Reject a leave request**
  export const rejectLeave = (req, res) => {
    const leaveId = parseInt(req.params.id);
    leaveRequests = leaveRequests.map((leave) =>
      leave.id === leaveId ? { ...leave, status: "Rejected" } : leave
    );
    res.json({ message: "Leave rejected!" });
  };
  