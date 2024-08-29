import multer from "multer";

const storage = multer.memoryStorage();
export const singleUpload = multer({ storage }).single("file");

// write a code for multiple file upload in file field name is resume and profilePhoto
export const multipleUpload = multer({ storage }).fields([
  { name: "resume", maxCount: 1 },
  { name: "profilePhoto", maxCount: 1 },
]);

// ... other functions (singleUpload, multipleUpload)
