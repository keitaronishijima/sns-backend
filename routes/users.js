const router = require("express").Router();
const User = require("../models/User");

//CRUD

//User info update

router.put("/:id", async (req, res) => {
  if (req.body.userId === req.params.id || req.body.isAdmin) {
    try {
      const user = await User.findByIdAndUpdate(req.params.id, {
        $set: req.body,
      });
      res.status(200).json("User information has been updated");
    } catch {}
  } else {
    return res.status(403).json("You can only edit your own account");
  }
});

router.delete("/:id", async (req, res) => {
  if (req.body.userId === req.params.id || req.body.isAdmin) {
    try {
      const user = await User.findByIdAndDelete(req.params.id);
      res.status(200).json("User information has been deleted");
    } catch {}
  } else {
    return res.status(403).json("You can only delete your own account");
  }
});
//User delete
//Get user info

router.get("/", async (req, res) => {
  const userId = req.query.userId;
  const username = req.query.username;
  try {
    const user = userId
      ? await User.findById(userId)
      : await User.findOne({ username: username });
    const { password, updatedAt, ...other } = user._doc;
    return res.status(200).json(other);
  } catch {
    return res.status(500).json(err);
  }
});

// router.get("/", async (req, res) => {
//   try {
//     const user = await User.findById(req.params.id);
//     const { password, updatedAt, ...other } = user._doc;
//     return res.status(200).json(other);
//   } catch {
//     return res.status(500).json(err);
//   }
// });

//follow users
router.put("/:id/follow", async (req, res) => {
  if (req.body.userId !== req.params.id) {
    try {
      const user = await User.findById(req.params.id);
      const currentUser = await User.findById(req.body.userId);
      if (!user.followers.includes(req.body.userId)) {
        //if the other's followers don't include current user
        await user.updateOne({
          $push: {
            followers: req.body.userId,
          },
        });
        await currentUser.updateOne({
          $push: {
            followings: req.params.id,
          },
        });
        return res.status(200).json("Success following");
      } else {
        return res.status(403).json("You are already following this user");
      }
    } catch (err) {
      return res.status(500).json(err);
    }
  } else {
    return res
      .status(500)
      .json("You are not allowed to follow your own account");
  }
});

//Unfollow users
router.put("/:id/unfollow", async (req, res) => {
  if (req.body.userId !== req.params.id) {
    try {
      const user = await User.findById(req.params.id);
      const currentUser = await User.findById(req.body.userId);
      if (user.followers.includes(req.body.userId)) {
        //if the other user's followers include current user
        await user.updateOne({
          $pull: {
            followers: req.body.userId,
          },
        });
        await currentUser.updateOne({
          $pull: {
            followings: req.params.id,
          },
        });
        return res.status(200).json("Success unfollowing");
      } else {
        return res.status(403).json("You not following this user");
      }
    } catch (err) {
      console.log(err);
      return res.status(500).json(err);
    }
  } else {
    return res
      .status(500)
      .json("You are not allowed to unfollow your own account");
  }
});

// router.get('/', (req, res) => {
//     res.send('user router')
// })

module.exports = router;
