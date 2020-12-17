const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt"); //Pkg required for encryption purpose.

const User = require("../models/user");

router.get("/", (req, res, next) => {
  User.find()
    .select("email password _id")
    // .populate('product', 'name')
    .exec()
    .then(docs => {
      res.status(200).json({
        count: docs.length,
        users: docs.map(doc => {
          return {
            _id: doc._id,
            email: doc.email,
            password: doc.password
          }
        }
        ),
        request: {
          type: "POST",
          url: "http://localhost:3000/user/login",
          body: { email: "String", passord: "Number" }
        }
      });
    })
    .catch(err => {
      res.status(500).json({
        error: err
      });
    });
});

router.post("/signup", (req, res, next) => {
  User.find({ email: req.body.email })
    .exec()
    .then(user => {
      if (user.length >= 1) {
        return res.status(409).json({
          message: "Mail exists"
        });
      } else {
        bcrypt.hash(req.body.password, 10, (err, hash) => {
          if (err) {
            return res.status(500).json({
              error: err
            });
          } else {
            const user = new User({
              _id: new mongoose.Types.ObjectId(),
              email: req.body.email,
              password: hash
            });
            user
              .save()
              .then(result => {
                console.log(result);
                res.status(201).json({
                  message: "User created"
                });
              })
              .catch(err => {
                console.log(err);
                res.status(500).json({
                  error: err
                });
              });
          }
        });
      }
    });
});

router.post("/login", (req, res, next) => {
  User.findOne({ email: req.body.email })
    .exec()
    .then(result => {

      if (result.length = 0) {

        return res.status(401).json({
          error: "Unauthorised."
        });
      }
      else if (bcrypt.compare(req.body.password, result.password)) {
        const token = jwt.sign({
          email: result.email,
          userId: result._id
        },
          process.env.JWT_KEY,
          { expiresIn: "1h" });

        return res.status(200).json({
          message: "Auth Successful.",
          token: token,
          request: {
            type: "GET",
            url: "http://localhost:3000/use/"
          }
        });
      }
      else {
        return res.status(401).json({
          error: "Unauthorised."
        });

      }
    })
    .catch(err => {
      console.log(err);
      res.status(401).json({
        error: "Unauthorised."
      });
    });
});

router.delete("/:userId", (req, res, next) => {
  User.remove({ _id: req.params.userId })
    .exec()
    .then(result => {
      res.status(200).json({
        message: "User deleted"
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
});

module.exports = router;
