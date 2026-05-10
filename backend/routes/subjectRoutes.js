import express from 'express';
import * as subjectController from '../controllers/subjectController.js';

const router = express.Router();

router.post('/add', subjectController.addSubject);
router.get('/all', subjectController.getSubjects);
router.get('/:id', subjectController.getSubject);
router.put('/:id', subjectController.updateSubjectInfo);
router.delete('/:id', subjectController.removeSubject);

export default router;