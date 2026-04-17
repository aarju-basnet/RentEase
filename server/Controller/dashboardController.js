const tenantDashboard = (req, res) => {
  res.json({
    success: true,
    message: "Welcome to Tenant Dashboard",
    user: req.user
  });
};

const ownerDashboard = (req, res) => {
  res.json({
    success: true,
    message: "Welcome to Owner Dashboard"
  });
};

const adminDashboard = (req, res) => {
  res.json({
    success: true,
    message: "Welcome to Admin Dashboard"
  });
};

module.exports = {
  tenantDashboard,
  ownerDashboard,
  adminDashboard
};