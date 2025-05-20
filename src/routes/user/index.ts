const express = require("express");
import { loginController } from "../../controllers/auth";

const router = express.Router();

router.post("/", loginController);

export { router as UserRouter };
