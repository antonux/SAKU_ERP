
const multer = require('multer');
const path = require('path');

// Configure storage engine for Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Define the folder to store images
    cb(null, './uploads');
  },
  filename: (req, file, cb) => {
    // Define the file name to avoid conflicts (use current date and file extension)
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

// Create a Multer instance with defined storage options
const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 },  // Limit file size to 5MB
  fileFilter: (req, file, cb) => {
    // Allow only image files
    const filetypes = /jpeg|jpg|png|gif/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (extname && mimetype) {
      return cb(null, true);
    } else {
      cb('Error: Only image files are allowed');
    }
  }
}).single('image'); // 'image' is the field name for the uploaded image

module.exports = upload;