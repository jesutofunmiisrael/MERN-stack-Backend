const User = require("../MODEL/Usermodel");
const { Parser } = require("json2csv");



const createUser = async (req, res) => {
  try {

    const existingUser = await User.findOne({
      email: req.body.email,
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Email already exists",
      });
    }

    const user = await User.create(req.body);

    res.status(201).json({
      success: true,
      message: "User created successfully",
      user,
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

const getUsers = async (req, res) => {
  try {

    const page = parseInt(req.query.page) || 1;

    const limit = parseInt(req.query.limit) || 5;

    const skip = (page - 1) * limit;


    const users = await User.find({})
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);


    const totalUsers = await User.countDocuments();


    res.status(200).json({
      success: true,
      users,
      currentPage: page,
      totalPages: Math.ceil(totalUsers / limit),
      totalUsers,
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};


const getSingleUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};



const updateUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
      }
    );

    res.status(200).json({
      success: true,
      message: "User updated successfully",
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};



const deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};



const searchUsers = async (req, res) => {
  try {
    const keyword = req.query.keyword;

    const users = await User.find({
      $or: [
        {
          firstName: {
            $regex: keyword,
            $options: "i",
          },
        },

        {
          lastName: {
            $regex: keyword,
            $options: "i",
          },
        },

        {
          email: {
            $regex: keyword,
            $options: "i",
          },
        },
      ],
    });

    res.status(200).json({
      success: true,
      users,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


const exportUsersCSV = async (req, res) => {
  try {
    const users = await User.find();

    const fields = [
      "firstName",
      "lastName",
      "email",
      "mobile",
      "gender",
      "status",
      "location",
    ];

    const json2csv = new Parser({ fields });

    const csv = json2csv.parse(users);

    res.header("Content-Type", "text/csv");

    res.attachment("users.csv");

    return res.send(csv);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


module.exports = {
  createUser,
  getUsers,
  getSingleUser,
  updateUser,
  deleteUser,
  searchUsers,
  exportUsersCSV,
};