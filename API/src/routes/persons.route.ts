import { Router } from "express";
import {
  createPerson,
  getAllPersons,
  updatePerson,
  deletePerson,
  getPersonById,
  getPersonByIdentifcation
} from "../controllers/persons.controller";

const router = Router();
// Más rutas aquí..

router.get("/", (req, res) => {
  res.send("Hello, Login!");
});

router.post("/createPerson", createPerson);
router.get("/getPersons", getAllPersons);
router.get("/getPersonById/:id_persona", getPersonById);
router.get("/getPersonByIdentifcation/:numero_identifiacion", getPersonByIdentifcation);
router.put("/updatePersons/:id_persona", updatePerson);
router.delete("/deletePersons/:id_persona", deletePerson);

export default router;