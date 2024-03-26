import { Controller, Get, Post, Param, UseInterceptors, UploadedFile, Res, Query, BadRequestException } from '@nestjs/common';
import { FilesService } from './files.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { ResponseMessage, SkipCheckPermission } from 'src/decorator/customize';
import { Response } from 'express';
import * as path from 'path';
import * as fs from 'fs';

@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) { }

  @Post('upload')
  @SkipCheckPermission()
  @ResponseMessage("Upload single file")
  @UseInterceptors(FileInterceptor('fileUpload'))
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    return {
      fileName: file.filename
    }
  }

  @Get('')
  @SkipCheckPermission()
  getFile(
    @Query("fileName") fileName: string,
    @Query("module") module: string,
    @Res() res: Response
  ) {
    return this.filesService.getFile(fileName, module, res);
  }

}

