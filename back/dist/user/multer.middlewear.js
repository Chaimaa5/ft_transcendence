"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Config = void 0;
const multer_1 = require("multer");
const path_1 = require("path");
exports.Config = {
    storage: (0, multer_1.diskStorage)({
        destination: './upload/',
        filename: (req, file, callback) => {
            const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
            const fileExtension = (0, path_1.extname)(file.originalname);
            const filename = `${uniqueSuffix}${fileExtension}`;
            callback(null, filename);
        },
    }),
};
//# sourceMappingURL=multer.middlewear.js.map