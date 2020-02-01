const cloudinary = require('cloudinary')
const multer = require('multer')
const cloudinaryStorage = require("multer-storage-cloudinary");
const env = require('../../env')

cloudinary.config({
    cloud_name: env.cloudinary_name,
    api_key: env.cloudinary_api_key,
    api_secret: env.cloudinary_api_secret
})


const parser = multer({
    storage: multer.diskStorage({}),
    fileFilter: (req, file, cb) => {
        if (!file.mimetype.match(/jpe|jpeg|png|gif$i/)) {
            cb(new Error("File is not supported"), false);
            return;
        }
        cb(null, true);
    }
});


module.exports = {
    parser,
    cloudinary
}