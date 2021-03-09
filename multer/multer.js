const multer = require('multer');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        if (process.env.NODE_ENV === 'test') {
            cb(null, './test/uploads/')
        }
        else {
            cb(null, './uploads/')
    
        }
        
    },
    filename: (req, file, cb) => {
        cb(null, new Date().toISOString().replace(/:/g, '-') + '-' + file.originalname);
    }
});



const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 10
    },
    fileFilter: fileFilter
})

module.exports = upload;