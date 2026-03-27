import multer from "multer";

const storage = multer.memoryStorage();
const upload = multer({ storage });

export const flexibleUpload = upload.fields([
  { name: "file", maxCount: 1 },
  { name: "files", maxCount: 5 },
]);
