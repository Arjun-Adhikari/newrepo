import express from 'express';
import * as studentController from '../controllers/studentController.js';

const router = express.Router();

router.post('/add', studentController.addStudent);
router.get('/all', studentController.getStudents);
router.get('/:id', studentController.getStudent);
router.put('/:id', studentController.updateStudentInfo);
router.delete('/:id', studentController.removeStudent);

export default router;