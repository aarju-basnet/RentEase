const express = require('express');
const router = express.Router();
const { addProperty, getOwnerProperties , getPropertyById, getThatProperties,
  deleteProperty, bulkDeleteProperties,deleteAllRejectedProperties
} = require('../Controller/propertyController') 
const { getAllProperties} = require('../Controller/adminController')
const { protect } = require('../middleware/authMiddleware');
const multer = require('multer');


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage });


router.use(protect);


router.post('/', upload.array('images', 4), addProperty);




router.get('/owner-properties', getOwnerProperties);
router.get('/', getAllProperties);

router.get('/:id', protect, getPropertyById);


router.get('/all-properties', getThatProperties);





router.delete('/:id', protect, deleteProperty);

router.delete('/bulk-delete', protect, bulkDeleteProperties);

router.delete('/delete-rejected/all', protect, deleteAllRejectedProperties);

module.exports = router;