import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { MulterModuleOptions, MulterOptionsFactory } from "@nestjs/platform-express";
import fs from 'fs'
import { diskStorage } from "multer";
import path, { join } from "path";

@Injectable()
export class MulterConfigService implements MulterOptionsFactory {
    getRootPath = () => {
        return process.cwd();
    }
    ensureExists(targetDirectory: string) {
        fs.mkdir(targetDirectory, { recursive: true }, (error) => {
            if (!error) {
                console.log('Directory successfully created, or it already exists.');
                return;
            }
            switch (error.code) {
                case 'EEXIST':
                    break;
                case 'ENOTDIR':
                    break;
                default:
                    console.error(error);
                    break;
            }
        })
    }
    createMulterOptions(): MulterModuleOptions {
        return {
            storage: diskStorage({
                destination: (req, file, cb) => {
                    const folder = req?.headers?.folder_type ?? "default";
                    this.ensureExists(`src/files/images/${folder}`);
                    cb(null, join(this.getRootPath(), `src/files/images/${folder}`))
                },
                filename: (req, file, cb) => {
                    function getCurrentDateDDMMYYYY(): string {
                        const currentDate = new Date();
                        const day = String(currentDate.getDate()).padStart(2, '0');
                        const month = String(currentDate.getMonth() + 1).padStart(2, '0');
                        const year = currentDate.getFullYear();

                        return day + month + year;
                    }

                    let extName = path.extname(file.originalname);
                    let finalName = `${req.headers.email}-${getCurrentDateDDMMYYYY()}${extName}`
                    cb(null, finalName)
                },
            }),
            fileFilter: (req, file, cb) => {
                const allowedFileTypes = ['jpg', 'jpeg', 'png', 'gif', 'tiff', 'tif'];
                const fileExtension = file.originalname.split('.').pop().toLowerCase();
                const isValidFileType = allowedFileTypes.includes(fileExtension);
                if (!isValidFileType) {
                    cb(new HttpException('Invalid file type', HttpStatus.UNPROCESSABLE_ENTITY), null);
                } else
                    cb(null, true);
            },
            limits: {
                fileSize: 1024 * 1024 * 1 // 1MB
            }
        };
    }
}