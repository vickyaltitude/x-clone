const bcrypt = require("bcrypt");
const cloudinary = require("cloudinary");

const notificationModel = require("../models/notification.model");
const User = require("../models/user.model");

module.exports.getProfile = async (req, res) => {
  try {
    const { username } = req.params;
    const user = await User.findOne({ username });

    if (!user) {
      res.status(400).json({ error: "User not found" });
    }

    res.status(200).json({ message: "user fetch success", user });
  } catch (err) {
    console.log("Error in user getProfile controller", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports.followUnFollowUser = async (req, res) => {
  try {
    const { id } = req.params;
    const userToModify = await User.findById({ _id: id });
    const currentUser = await User.findById({ _id: req.user._id });

    if (id === req.user._id.toString()) {
      return res
        .status(400)
        .json({ error: "You can't follow or unfollow yourself" });
    }

    if (!userToModify || !currentUser) {
      return res.status(400).json({ error: "User not found" });
    }

    const isFollowing = currentUser.following.includes(id);

    if (isFollowing) {
      await User.findByIdAndUpdate(
        { _id: id },
        { $pull: { followers: req.user._id } }
      );

      await User.findByIdAndUpdate(
        { _id: req.user._id },
        { $pull: { following: id } }
      );

      res.status(200).json({ message: "User unfollowed successfully" });
    } else {
      await User.findByIdAndUpdate(
        { _id: id },
        { $push: { followers: req.user._id } }
      );

      await User.findByIdAndUpdate(
        { _id: req.user._id },
        { $push: { following: id } }
      );

      const newNotification = new notificationModel({
        from: req.user._id,
        to: id,
        type: "follow",
      });

      await newNotification.save();

      res.status(200).json({ message: "User followed successfully" });
    }
  } catch (err) {
    console.log("Error in user followUnFollowUser controller", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports.getSuggestedUser = async (req, res) => {
  try {
    const userId = req.user._id;
    const userFollowedByMe = await User.findOne({ _id: userId }).select(
      "-password"
    );

    const users = await User.aggregate([
      {
        $match: {
          _id: {
            $ne: userId,
          },
        },
      },
      {
        $sample: {
          size: 10,
        },
      },
    ]);

    const filteredUsers = users.filter(
      (user) => !userFollowedByMe.following.includes(user._id)
    );
    const suggestedUsers = filteredUsers.slice(0, 4);
    suggestedUsers.forEach((user) => (user.password = null));

    res
      .status(200)
      .json({ message: "Suggested users fetch success", suggestedUsers });
  } catch (err) {
    console.log("Error in user getSuggestedUser controller", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports.updateUser = async (req, res) => {
  try {
    const userId = req.user._id;
    let user = await User.findOne({ _id: userId });
    let {
      username,
      fullName,
      email,
      currentPassword,
      newPassword,
      bio,
      link,
    } = req.body;
    let { profileImg, coverImg } = req.body;

    if (!user) {
      return res.status(400).json({ error: "user not found" });
    }

    if (
      (!currentPassword && newPassword) ||
      (currentPassword && !newPassword)
    ) {
      return res
        .status(400)
        .json({ error: "Please provide both new password and old password" });
    }

    if (currentPassword && newPassword) {
      const isMatch = bcrypt.compare(currentPassword, user.password);
      if (!isMatch) {
        return res
          .status(400)
          .json({ error: "Entered current password is incorrect" });
      }
      if (newPassword.length < 6) {
        return res
          .status(400)
          .json({ error: "Password length should be equal to or more than 6" });
      }

      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(newPassword, salt);
    }

    if (profileImg) {
      if (user.profileImg) {
        await cloudinary.uploader.destroy(
          user.profileImg.split("/").pop().split(".")[0]
        );
      }
      const uploadedResponse = await cloudinary.uploader.upload(profileImg);
      profileImg = uploadedResponse.secure_url;
    }
    if (coverImg) {
      if (user.coverImg) {
        await cloudinary.uploader.destroy(
          user.coverImg.split("/").pop().split(".")[0]
        );
      }
      const uploadedResponse = await cloudinary.uploader.upload(coverImg);
      coverImg = uploadedResponse.secure_url;
    }

    user.fullName = fullName || user.fullName;
    user.username = username || user.username;
    user.email = email || user.email;
    user.bio = bio || user.bio;
    user.link = link || user.link;
    user.profileImg = profileImg || user.profileImg;
    user.coverImg = coverImg || user.coverImg;

    user = await user.save();
    user.password = null;
    res.status(200).json({ message: "user updated successfully", user });
  } catch (err) {
    console.log("Error in user updateUser controller", err);
    res.status(500).json({ error: "Internal server error" });
  }
};
