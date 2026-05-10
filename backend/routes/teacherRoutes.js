import express from 'express';
import * as teacherController from '../controllers/teacherController.js';

const router = express.Router();

router.post('/add', teacherController.addTeacher);
router.get('/all', teacherController.getTeachers);
router.get('/:id', teacherController.getTeacher);
router.put('/:id', teacherController.updateTeacherInfo);
router.delete('/:id', teacherController.removeTeacher);

export default router;