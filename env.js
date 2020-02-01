module.exports = {
    mongodb_url : process.env.MONGODB_URL,
    secret: process.env.SECRET,
    port : process.env.PORT || 4000,
    cloudinary_api_key: process.env.CLOUDINARY_API_KEY,
    cloudinary_api_secret: process.env.CLOUDINARY_API_SECRET,
    cloudinary_name:process.env.CLOUDINARY_NAME,
}

//MONGODB_URL=mongodb://localhost:27017/jetcakedb