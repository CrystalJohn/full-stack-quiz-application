import mongoose from "mongoose";
import { ApiError } from "../utils/ApiError.js";

export const validateObjectIdParam = (key) => (req, _res, next) => {
  if (!mongoose.Types.ObjectId.isValid(req.params[key])) {
    return next(new ApiError(400, `Invalid ObjectId: ${key}`));
  }
  next();
};