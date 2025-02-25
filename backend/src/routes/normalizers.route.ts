import { Router } from "express";
import {
    createNormalizers,
    updateNormalizers,
    getNormalizersById,
    getAllNormalizers,
    getNormalizeByCompany,
} from "../controllers/normalizers.controller";

const router = Router();

router.get("/", (req, res) => {
    res.send("Hello, Login!");
});

router.post("/createNormalizers", createNormalizers);
router.get("/getAllNormalizers", getAllNormalizers);
router.get("/getNormalizersById/:id", getNormalizersById);
router.get("/getNormalizeByCompany/:empresa", getNormalizeByCompany);
router.put("/updateNormalizers/:id", updateNormalizers);

export default router;
