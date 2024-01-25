import express from "express";

const router = express.Router();

router.get("/", (_req, res) => {
    res.send({ message: "Hello World from Admin" });
});

export default router;