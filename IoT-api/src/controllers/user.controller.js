import {
  getAllUsers,
  getUserById,
  createUser,
  updateUserRole,
  deleteUser,
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
