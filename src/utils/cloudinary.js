import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import dotenv from "dotenv";

dotenv.config();

// ✅ Cloudinary Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

console.log("✅ Cloudinary config loaded:", {
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  secret: process.env.CLOUDINARY_API_SECRET ? "✅ Loaded" : "❌ Missing",
});

// ✅ Upload function
const uploadCloudinary = async (localFilePath, folder = "vidtube") => {
  try {
    if (!localFilePath) return null;

    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
      folder: folder, // keep uploads inside a folder
    });

    console.log("✅ Uploaded:", response.secure_url);

    // delete local file after upload
    fs.unlinkSync(localFilePath);
    return response;
  } catch (error) {
    console.error("❌ Cloudinary Upload Error:", error.message);

    if (fs.existsSync(localFilePath)) {
      fs.unlinkSync(localFilePath);
    }
    return null;
  }
};

const deleteFromCloudinary = async (publicId) => {
    try {
        const result = await cloudinary.uploader.destroy(publicId)

    } catch (error) {
        console.log("Error deleting from cloudinary",error);
        return null
        
    }
}

export { uploadCloudinary, deleteFromCloudinary };
