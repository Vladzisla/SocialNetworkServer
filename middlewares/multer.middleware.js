const multer = require('multer')
const { v4: uuidv4 } = require('uuid');

const storageConfig = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/assets/images/');
    },
    filename: (req, file, cb) => {
        const arr = file.originalname.split('.');
        cb(null, uuidv4() + '.' +arr[arr.length - 1]);
    }
});

module.exports = multer({storage: storageConfig}).single('filedata')