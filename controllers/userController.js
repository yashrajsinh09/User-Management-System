const { generateToken } = require("../helper/jwtToken");
const { giveResponse } = require("../helper/res_help");
const asyncHandler = require("../middleware/async");
const CMS_user = require("../models/user");

exports.CMS_setupSuperAdmin = asyncHandler(async (req, res) => {
  const superAdminExists = await CMS_user.exists({ role: "Super Admin" });

  if (superAdminExists) {
    return giveResponse(res, 400, false, "Super Admin already exists");
  }
  // Create the Super Admin
  const { username, password, email } = req.body;

  const superAdmin = new CMS_user({
    email,
    username,
    password,
    role: "Super Admin",
    status: "Active",
    verified: true,
  });

  await superAdmin.save();

  return giveResponse(res, 201, true, "Super Admin created successfully", superAdmin);
});

exports.CMS_login = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;

  const findUser = await CMS_user.findOne({ email });

  if (findUser.verified === false || findUser.status === "Deactive") {
    return giveResponse(
      res,
      400,
      false,
      "Your account are Unverified or Deactive"
    );
  }

  if (findUser && (await findUser.isPasswordMatched(password))) {
    delete req.body.password;
    return giveResponse(res, 200, true, "Login Successfull", {
      ...req.body,
      token: generateToken(findUser?._id),
    });
  } else {
    return giveResponse(res, 400, false, "Invalid Credentials");
  }
});

exports.CMS_createUser = asyncHandler(async (req, res) => {
  var { username, email, password, role } = req.body;
  const adminRole = req.user.role;

  if (adminRole === "Super Admin") {
    role = role || "User";
  } else if (adminRole === "Admin") {
    role = "User";
  }

  const user = await CMS_user.create({
    email,
    username,
    password,
    role,
    status: "Active",
  });

  return giveResponse(res, 201, true, "user created successfully", user);
});

exports.CMS_updateUser = asyncHandler(async (req, res) => {
  const { userId, role, verified, status } = req.body;
  const adminRole = req.user.role;

  const allowedRoles = ["Super Admin", "Admin", "User"];
  const allowedStatus = ["Active", "Deactive"];

  if (role && !allowedRoles.includes(role)) {
    return giveResponse(res, 400, false, "Invalid role value");
  }
  if (status && !allowedStatus.includes(status)) {
    return giveResponse(res, 400, false, "Invalid status value");
  }

  const user = await CMS_user.findById(userId);
  if (!user) {
    return giveResponse(res, 404, false, "User not found");
  }
  // Check if the admin is an Admin (not Super Admin)
  if (adminRole === "Admin") {
    // Admin can update only the status field
    if (role || typeof verified !== "undefined") {
      return giveResponse(
        res,
        403,
        false,
        "Admins cannot update user role or verified status"
      );
    }
    if (status) {
      user.status = status;
    }
  } else if (adminRole === "Super Admin") {
    // Super Admin can update role, status, and verified fields using query
    const updateFields = {};

    if (role) {
      updateFields.role = role;
    }
    if (typeof verified === "boolean") {
      updateFields.verified = verified;
    }
    if (status) {
      updateFields.status = status;
    }
    // Update the user using a query
    var updatedUser = await CMS_user.findOneAndUpdate(
      { _id: userId },
      { $set: updateFields },
      { new: true }
    );

    // Check if the update was successful
    // var updatedUser = await CMS_user.findById(userId);
    if (!updatedUser) {
      return giveResponse(res, 400, false, "Failed to update user");
    }
  }
  await user.save();

  return giveResponse(
    res,
    200,
    true,
    "User role updated successfully",
    updatedUser
  );
});

exports.CMS_deleteUser = asyncHandler(async (req, res) => {
  const { userId } = req.body; // Assuming userId is part of the request parameters
  const adminRole = req.user.role;

  // Check if the user to be deleted exists
  const userToDelete = await CMS_user.findById(userId);

  if (!userToDelete) {
    return giveResponse(res, 404, false, "User not found");
  }

  if (userToDelete.role === "Super Admin") {
    return giveResponse(res, 403, false, "cannot delete Super Admins");
  }

  // Perform the deletion
  await CMS_user.findByIdAndDelete(userId);

  return giveResponse(res, 200, true, "User deleted successfully");
});

exports.CMS_getAllUsers = asyncHandler(async (req, res) => {
  try {
    const { page = 1, perPage = 10 } = req.query;

    const currentPage = parseInt(page);
    const itemsPerPage = parseInt(perPage);

    const skip = (currentPage - 1) * itemsPerPage;

    const aggregationPipeline = [
      {
        $sort: { username: 1 },
      },
      {
        $project: {
          _id: 1,
          username: 1,
          role: 1,
          status: 1,
        },
      },
      {
        $skip: skip,
      },
      {
        $limit: itemsPerPage,
      },
    ];

    const allUsers = await CMS_user.aggregate(aggregationPipeline);

    return giveResponse(
      res,
      200,
      true,
      "All users retrieved successfully",
      allUsers
    );
  } catch (error) {
    return giveResponse(
      res,
      500,
      false,
      "An error occurred while fetching users"
    );
  }
});

exports.CMS_getUser = asyncHandler(async (req, res) => {
  const userId = req.body.userId;

  if (userId) {
    const user = await CMS_user.findById(userId);
    if (!user) {
      return giveResponse(res, 404, false, "User not found");
    }
    return giveResponse(res, 200, true, "User retrieved successfully", user);
  } else {
    return giveResponse(
      res,
      500,
      false,
      "An error occurred while fetching the user"
    );
  }
});
