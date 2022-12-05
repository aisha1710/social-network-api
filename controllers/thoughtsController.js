const { User, Thought } = require("../models");

const thoughtController = {
  getAllThought(req, res) {
    Thought.find({})
      .then((dbThought) => res.json(dbThought))
      .catch((err) => res.status(500).json(err));
  },

  getSingleThought({ params }, res) {
    Thought.findOne({ _id: params.thoughtId })
      .select("-__v")
      .then((dbThought) => {
        if (!dbThought) {
          res.status(404).json({ message: "No thoughts exist for this id!" });
          return;
        }
        res.json(dbThought);
      })
      .catch((err) => res.status(500).json(err));
  },

  createThought({ body }, res) {
    Thought.create(body)
      .then(({ _id }) => {
        return User.findOneAndUpdate(
          { _id: body.userId },
          { $push: { thoughts: _id } },
          { new: true }
        );
      })
      .then((dbThought) => {
        if (!dbThought) {
          res.status(404).json({ message: "No user found with this id!" });
          return;
        }
        res.json(dbThought);
      })
      .catch((err) => res.status(500).json(err));
  },
};
module.exports = thoughtController;
