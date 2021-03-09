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

const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null, true);
    }
    else {
        cb(new Error("image must be jpeg or png"), false);
    }

};

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 10
    },
    fileFilter: fileFilter
})

module.exports = upload;