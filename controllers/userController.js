const { User, Thought } = require("../models");

const userController = {
  getAllUser(req, res) {
    User.find({})
      .select("-__v")
      .then((dbUser) => res.json(dbUser))
      .catch((err) => {
        console.log(err);
        res.sendStatus(400);
      });
  },

  getSingleUser({ params }, res) {
    User.findOne({ _id: params.userId })
      .select("-__v")
      .populate({
        path: "thoughts",
      })
      .populate({
        path: "friends",
      })
      .then((dbUser) => {
        if (!dbUser) {
          res.status(404).json({ message: "No User found with this id!" });
          return;
        }
        res.json(dbUser);
      })
      .catch((err) => {
        console.log(err);
        res.sendStatus(400);
      });
  },

  createUser({ body }, res) {
    User.create(body)
      .then((dbUser) => res.json(dbUser))
      .catch((err) => res.json(err));
  },
  updateUser({ params, body }, res) {
    User.findOneAndUpdate({ _id: params.userId }, body, {
      new: true,
      runValidators: true,
    })
      .then((dbUser) => {
        if (!dbUser) {
          res.status(404).json({ message: "No User found with this id!" });
          return;
        }
        res.json(dbUser);
      })
      .catch((err) => res.status(500).json(err));
  },

  deleteUser({ params }, res) {
    Thought.deleteMany({ _id: params.thoughtId })
      .then(() => {
        User.findOneAndDelete({ _id: params.userId }).then((dbUser) => {
          if (!dbUser) {
            res.status(404).json({ message: "No User found with this id!" });
            return;
          }
          res.json(dbUser);
        });
      })
      .catch((err) => res.status(500).json(err));
  },

  addFriend({ params }, res) {
    User.findOneAndUpdate(
      { _id: params.userId },
      { $push: { friends: params.friendId } },
      { new: true }
    )
      .then((dbUser) => {
        if (!dbUser) {
          res.status(404).json({ message: "No user found with this id" });
          return;
        }
        res.json(dbUser);
      })
      .catch((err) => res.status(400).json(err));
  },

  deleteFriend({ params }, res) {
    User.findOneAndUpdate(
      { _id: params.userId },
      { $pull: { friends: params.friendId } },
      { new: true }
    )
      .then((dbUser) => {
        if (!dbUser) {
          res.status(404).json({ message: "No user found with this id" });
          return;
        }
        res.json(dbUser);
      })
      .catch((err) => res.status(400).json(err));
  },
};

module.exports = userController;
