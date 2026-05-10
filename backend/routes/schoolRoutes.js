import express from 'express';
import * as schoolController from '../controllers/schoolController.js';

const router = express.Router();

router.post('/add', schoolController.addSchool);
router.get('/all', schoolController.getSchools);
router.get('/:id', schoolController.getSchool);
router.put('/:id', schoolController.updateSchoolInfo);
router.delete('/:id', schoolController.removeSchool);

export default router;