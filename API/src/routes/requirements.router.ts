import { Router } from "express";
import { createRequirements, getRequirementsByPerson,getRequirementsById, getRequirementsByIdentification, updateRequirements, getAllRequirements } from "../controllers/requirements.controller";

const router = Router();

router.get("/", (req, res) => {
    res.send("Hello, Login!");
});

router.post("/createRequirements", createRequirements);
router.get("/getAllRequirements", getAllRequirements);
router.get("/getRequirementsByPerson/:id_persona", getRequirementsByPerson);
router.get("/getRequirementsById/:id_requisito", getRequirementsById);
router.get("/getRequirementsByIdentification/:identificacion", getRequirementsByIdentification);
router.put("/updateRequirements/:id_requisito", updateRequirements);

export default router;
