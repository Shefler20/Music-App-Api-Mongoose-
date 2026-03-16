import multer from "multer";
import {promises as fs} from "fs";
import path from "path";
import { randomUUID } from "crypto";
import config from "../../Search(MongoDB)+API+Frontend/API/config";

const imageStore = multer.diskStorage({
    destination: async (_req, _file, callback) => {
        const destDir = path.join(config.publicPath, "images");
        await fs.mkdir(destDir, { recursive: true });
        callback(null, destDir);
    },
    filename: (_req, file, callback) => {
        const extension = path.extname(file.originalname);
        callback(null, randomUUID()+extension);
    },
});

export default imageStore;
