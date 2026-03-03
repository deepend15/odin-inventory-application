import { body } from "express-validator";

export const validatePassword = [
  body("password")
    .notEmpty().withMessage("Password is required.")
    .custom((value) => {
      return value === process.env.ADMIN_PW;
    }).withMessage("Incorrect password."),
];
