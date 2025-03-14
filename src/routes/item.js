const express = require("express");
const Item = require("../models/item");
const Auth = require("../middleware/auth");

const router = new express.Router();

//fetch all items
router.get("/item", async (req, res) => {
  // #swagger.tags = ['Item']
  // #swagger.description = 'Fetch all product items'
  // #swagger.summary = 'Fetch all product items'
  if (req.query.user == 1) {
    try {
      const items = await Item.find({ owner: req.user._id });
      res.status(200).send(items);
    } catch (error) {
      console.log(error);
      res.status(500).send("something went wrong");
    }
  } else {
    try {
      const items = await Item.find({});
      res.status(200).send(items);
    } catch (error) {
      res.status(400).send(error);
    }
  }
});

//fetch an item
router.get("/item/:id", Auth, async (req, res) => {
  // #swagger.tags = ['Item']
  // #swagger.description = 'Fetch a product item using the item ID'
  // #swagger.summary = 'Fetch a product item using the item ID'
  try {
    const item = await Item.findOne({ _id: req.params.id });
    if (!item) {
      res.status(404).send({ error: "Item not found" });
    }
    res.status(200).send(item);
  } catch (error) {
    res.status(400).send(error);
  }
});

//create an item
router.post("/item", Auth, async (req, res) => {
  // #swagger.tags = ['Item']
  // #swagger.description = 'Create a new product item'
  // #swagger.summary = 'Create a new product item'
  try {
    const newItem = new Item({
      ...req.body,
      owner: req.user._id,
    });
    await newItem.save();
    res.status(201).send(newItem);
  } catch (error) {
    console.log({ error });
    res.status(400).send({ message: "error" });
  }
});

//update an item
router.patch("/item/:id", Auth, async (req, res) => {
  // #swagger.tags = ['Item']
  // #swagger.description = 'Update a product item using the item ID'
  // #swagger.summary = 'Update a product item using the item ID'
  const updates = Object.keys(req.body);
  const allowedUpdates = ["name", "description", "category", "price"];

  const isValidOperation = updates.every((update) =>
    allowedUpdates.includes(update)
  );

  if (!isValidOperation) {
    return res.status(400).send({ error: "invalid updates" });
  }

  try {
    const item = await Item.findOne({ _id: req.params.id });

    if (!item) {
      return res.status(404).send();
    }

    updates.forEach((update) => (item[update] = req.body[update]));
    await item.save();
    res.send(item);
  } catch (error) {
    res.status(400).send(error);
  }
});

//delete item
router.delete("/item/:id", Auth, async (req, res) => {
  // #swagger.tags = ['Item']
  // #swagger.description = 'Delete a product item using the item ID'
  // #swagger.summary = 'Delete a product item using the item ID'
  try {
    const deletedItem = await Item.findOneAndDelete({ _id: req.params.id });
    if (!deletedItem) {
      res.status(404).send({ error: "Item not found" });
    }
    res.send(deletedItem);
  } catch (error) {
    res.status(400).send(error);
  }
});

module.exports = router;
