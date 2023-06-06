const express = require("express");
const studentModel = require("../models/studentModel");
const { sendResponse } = require("../helper/helper");
const StudentController = require("../controllers/studentControllers");

const route = express.Router();

route.get("/", StudentController.getStudents);
route.get("/search", StudentController.searchStudents);
route.get("/students",StudentController.getStudentsByPagination )
route.get("/:id", StudentController.getStudentsById);
route.post("/",StudentController.postStudents );
route.put("/:id", StudentController.editStudents);
route.delete("/:id", StudentController.deleteStudents);

module.exports = route;
