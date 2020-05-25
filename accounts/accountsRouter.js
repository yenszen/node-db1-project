const express = require("express");
const db = require("../data/dbConfig");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const accounts = await db("accounts");
    res.status(200).json(accounts);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Database error", Error: err });
  }
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const account = await db
      .select("*")
      .from("accounts")
      .where({ id });

    account.length > 0
      ? res.status(200).json(account)
      : res
          .status(404)
          .json({ message: "Account with specified ID does not exist" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Database error", Error: err });
  }
});

router.post("/", async (req, res) => {
  const postData = req.body;

  try {
    if (!postData.name || !postData.budget) {
      res.status(400).json({ message: "Please include both name and budget" });
    } else {
      const newAcc = await db.insert(postData).into("accounts");
      res.status(201).json(newAcc);
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Database error", Error: err });
  }
});

router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const changes = req.body;

  try {
    const edited = await db("accounts")
      .where({ id })
      .update(changes);

    edited
      ? res.status(200).json({ updated: edited })
      : res
          .status(404)
          .json({ message: "Account with specified ID does not exist" });
  } catch (err) {
    res.status(400).json({ message: "Please include both name and budget" });
  }
});

router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const deleted = await db("accounts")
      .del()
      .where({ id });

    deleted
      ? res.status(200).json({ message: "Account removed" })
      : res
          .status(404)
          .json({ message: "Account with specified ID does not exist" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Database error", Error: err });
  }
});

module.exports = router;
