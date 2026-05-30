const { v2: cloudinary } = require('cloudinary');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: path.join(__dirname, '.env') });

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

console.log("Configured Cloudinary with cloud_name:", process.env.CLOUDINARY_CLOUD_NAME);

const pdfPath = 'S:\\Portfolio\\Mahi Re.pdf';
console.log("Reading PDF from:", pdfPath);

if (!fs.existsSync(pdfPath)) {
  console.error("PDF file not found!");
  process.exit(1);
}

const fileBuffer = fs.readFileSync(pdfPath);

// Option A: Upload as standard resource (which allows previewing/delivery)
cloudinary.uploader.upload_stream(
  { folder: 'resumes' },
  (error, result) => {
    if (error) {
      console.error("Option A Error:", error);
    } else {
      console.log("Option A (Default) Success!");
      console.log("Secure URL:", result.secure_url);
    }
    
    // Option B: Upload as raw resource (extremely safe for binary delivery)
    cloudinary.uploader.upload_stream(
      { folder: 'resumes', resource_type: 'raw' },
      (error2, result2) => {
        if (error2) {
          console.error("Option B Error:", error2);
        } else {
          console.log("Option B (Raw) Success!");
          console.log("Secure URL:", result2.secure_url);
        }
        process.exit(0);
      }
    ).end(fileBuffer);
  }
).end(fileBuffer);
