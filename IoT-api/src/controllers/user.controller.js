import {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  updateUserRole,
  deleteUser,
  updateProfile,
  changePassword,
  resetPassword,
  uploadAvatar,
} from "../services/user.service.js";

export const listUsers = async (req, res) => {
  try {
    const users = await getAllUsers();
    res.status(200).json({
      success: true,
      data: { users },
    });
  } catch (error) {
    res.status(error.status || 500).json({
      success: false,
      message: error.message || "Failed to fetch users",
    });
  }
};

export const getUser = async (req, res) => {
  try {
    const user = await getUserById(Number(req.params.id));
    res.status(200).json({
      success: true,
      data: { user },
    });
  } catch (error) {
    res.status(error.status || 500).json({
      success: false,
      message: error.message || "Failed to fetch user",
    });
  }
};

export const createUserHandler = async (req, res) => {
  try {
    const user = await createUser(req.body);
    res.status(201).json({
      success: true,
      message: "User created successfully",
      data: { user },
    });
  } catch (error) {
    res.status(error.status || 500).json({
      success: false,
      message: error.message || "Failed to create user",
    });
  }
};

export const updateUserHandler = async (req, res) => {
  try {
    const user = await updateUser(Number(req.params.id), req.body);
    res.status(200).json({
      success: true,
      message: "User updated successfully",
      data: { user },
    });
  } catch (error) {
    res.status(error.status || 500).json({
      success: false,
      message: error.message || "Failed to update user",
    });
  }
};

export const changeUserRole = async (req, res) => {
  try {
    const { role } = req.body;
    if (!role) {
      return res.status(400).json({
        success: false,
        message: "Role is required",
      });
    }

    const user = await updateUserRole(Number(req.params.id), role);
    res.status(200).json({
      success: true,
      message: "Role updated successfully",
      data: { user },
    });
  } catch (error) {
    res.status(error.status || 500).json({
      success: false,
      message: error.message || "Failed to update role",
    });
  }
};

export const removeUser = async (req, res) => {
  try {
    const result = await deleteUser(Number(req.params.id));
    res.status(200).json({
      success: true,
      message: result.message,
    });
  } catch (error) {
    res.status(error.status || 500).json({
      success: false,
      message: error.message || "Failed to delete user",
    });
  }
};

export const updateProfileHandler = async (req, res) => {
  try {
    const user = await updateProfile(req.user.id, req.body);
    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: { user },
    });
  } catch (error) {
    res.status(error.status || 500).json({
      success: false,
      message: error.message || "Failed to update profile",
    });
  }
};

export const changePasswordHandler = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Current password and new password are required",
      });
    }
    if (newPassword.length < 8) {
      return res.status(400).json({
        success: false,
        message: "New password must be at least 8 characters",
      });
    }
    const result = await changePassword(req.user.id, { currentPassword, newPassword });
    res.status(200).json({
      success: true,
      message: result.message,
    });
  } catch (error) {
    res.status(error.status || 500).json({
      success: false,
      message: error.message || "Failed to change password",
    });
  }
};

export const resetPasswordHandler = async (req, res) => {
  try {
    const result = await resetPassword(Number(req.params.id), req.body.newPassword);
    res.status(200).json({
      success: true,
      message: result.message,
    });
  } catch (error) {
    res.status(error.status || 500).json({
      success: false,
      message: error.message || "Failed to reset password",
    });
  }
};

export const uploadAvatarHandler = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No image file provided",
      });
    }
    const user = await uploadAvatar(req.user.id, req.file);
    res.status(200).json({
      success: true,
      message: "Avatar uploaded successfully",
      data: { user },
    });
  } catch (error) {
    res.status(error.status || 500).json({
      success: false,
      message: error.message || "Failed to upload avatar",
    });
  }
};
