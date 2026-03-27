"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateFolderPath = exports.rollbackCloudinaryUploads = exports.uploadFilesToCloudinary = void 0;
const cloudinary = __importStar(require("cloudinary"));
const uuid_1 = require("uuid");
const config_1 = require("../config");
cloudinary.v2.config({
    cloud_name: config_1.config.CLOUDINARY_CLOUD_NAME,
    api_key: config_1.config.CLOUDINARY_API_KEY,
    api_secret: config_1.config.CLOUDINARY_API_SECRET,
});
// Helper to upload a single file to Cloudinary
const uploadToCloudinary = (fileBuffer, folder, publicId) => {
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.v2.uploader.upload_stream({
            folder,
            public_id: publicId,
            resource_type: "auto",
        }, (error, result) => {
            if (error)
                return reject(error);
            resolve(result);
        });
        uploadStream.end(fileBuffer);
    });
};
// Helper to delete files from Cloudinary
const deleteFromCloudinary = async (publicIds) => {
    try {
        if (publicIds.length > 0) {
            await cloudinary.v2.api.delete_resources(publicIds);
        }
    }
    catch (error) {
        console.error('Failed to cleanup Cloudinary files:', error);
    }
};
// Upload files without database persistence (for transaction-like behavior)
const uploadFilesToCloudinary = async (files, type, userId) => {
    if (!files || !Array.isArray(files) || files.length === 0) {
        throw new Error("No files uploaded");
    }
    const today = new Date();
    const folderPath = `love/${type || "default"}/${today.getFullYear()}/${today.getMonth() + 1}/${today.getDate()}`;
    const uploadedFiles = [];
    const uploadedPublicIds = [];
    try {
        for (const file of files) {
            const { buffer, originalname } = file;
            const id = (0, uuid_1.v4)();
            const result = await uploadToCloudinary(buffer, folderPath, id);
            uploadedPublicIds.push(result.public_id);
            uploadedFiles.push({
                cloudinaryId: result.public_id,
                url: result.secure_url,
                fileName: originalname,
                uploadedAt: new Date().toISOString(),
            });
        }
        return uploadedFiles;
    }
    catch (error) {
        // Cleanup uploaded files if any upload failed
        await deleteFromCloudinary(uploadedPublicIds);
        throw new Error(`File upload failed: ${error.message}`);
    }
};
exports.uploadFilesToCloudinary = uploadFilesToCloudinary;
// Rollback function to delete uploaded files
const rollbackCloudinaryUploads = async (uploadedFiles) => {
    const publicIds = uploadedFiles.map(file => file.cloudinaryId);
    await deleteFromCloudinary(publicIds);
};
exports.rollbackCloudinaryUploads = rollbackCloudinaryUploads;
// Generate folder path
const generateFolderPath = (type) => {
    const today = new Date();
    return `love/${type || "default"}/${today.getFullYear()}/${today.getMonth() + 1}/${today.getDate()}`;
};
exports.generateFolderPath = generateFolderPath;
//# sourceMappingURL=cloudinary.js.map