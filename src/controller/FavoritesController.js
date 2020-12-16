const User = require('../models/User');
const Plant = require('../models/Plant');

class FavoritesController {
  static async createFavorite(req, res) {
    try {
      const user = await User.findById(req.userId).populate([
        { path: 'topics', populate: 'plant' },
        { path: 'myPlants', populate: 'plant' },
        { path: 'favorites', populate: 'plant' },
      ]);
      const plant = await Plant.findById(req.params.plantId);
      if (
        user.favorites.some(
          (favorite) =>
            JSON.stringify(favorite?._id) === JSON.stringify(plant._id)
        )
      )
        return res.status(200).send(user);

      if (user.favorites.indexOf(plant) === -1) {
        user.favorites.push(plant);
        await user.save();
      } else {
        throw new Error("invalid plant/user or it's already been added");
      }

      return res.status(200).send(user);
    } catch (err) {
      return res.status(400).send(err);
    }
  }

  static async listFavorites(req, res) {
    try {
      const user = await User.findById(req.params.userId);
      const { favorites } = user;

      return res.status(200).send({ favorites });
    } catch (err) {
      return res.status(400).send({ error: `Error loading favorites. ${err}` });
    }
  }

  static async deleteFavorite(req, res) {
    try {
      const user = await User.findById(req.userId);
      const index = user.favorites.indexOf(req.params.plantId);

      if (index > -1) {
        user.favorites.splice(index, 1);
        await user.save();
      } else {
        return res.status(400).send({
          error: `Could not delete Plant from favorites since it wasn't added first.`,
        });
      }
      const newUser = await User.findById(req.userId).populate([
        { path: 'topics', populate: 'plants' },
        { path: 'myPlants', populate: 'plant' },
        { path: 'favorites', populate: 'plant' },
      ]);
      return res.status(200).send(newUser);
    } catch (err) {
      return res
        .status(400)
        .send({ error: `Error deleting favorite. ${err} ` });
    }
  }
}

module.exports = FavoritesController;
