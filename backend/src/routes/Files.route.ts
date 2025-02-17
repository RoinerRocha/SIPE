import { Router } from "express";
import {
    updateFiles,
    getFilesByCode,
    getHistoryFiles,
    getFilesByPerson,
    getAllFiles,
} from "../controllers/files.controller";

const router = Router();
// Más rutas aquí..

router.get("/", (req, res) => {
  res.send("Hello, Login!");
});

router.get("/getAllFiles", getAllFiles);
router.get("/getFilesByCode/:codigo", getFilesByCode);
router.get("/getHistoryFiles/:codigo", getHistoryFiles);
router.get("/getFilesByPerson/:identificacion", getFilesByPerson);
router.put("/updateFiles/:codigo", updateFiles);

export default router;
