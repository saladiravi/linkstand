const path = require('path');
const multer = require('multer');
const fs = require('fs');
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Store files in the 'uploads' folder
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`); // Rename file with timestamp
  }
});

const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/jpg','application/pdf'];
    if (!allowedMimeTypes.includes(file.mimetype)) {
      return cb(new Error('Only images are allowed!'), false);
    }
    cb(null, true);
  }
});



 
module.exports = upload;

