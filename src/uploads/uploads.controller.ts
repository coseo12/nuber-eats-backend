import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import * as AWS from 'aws-sdk';

const BUCKET_NAME = 'coseonuberbucket12';

@Controller('uploads')
export class UploadsController {
  @Post('')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file) {
    AWS.config.update({
      credentials: {
        accessKeyId: process.env.AWS_KEY,
        secretAccessKey: process.env.AWA_SECRET_KEY,
      },
    });
    const objectName = `${Date.now() + file.originalname}`;
    try {
      await new AWS.S3()
        .putObject({
          Body: file.buffer,
          Bucket: BUCKET_NAME,
          Key: objectName,
          ACL: 'public-read',
        })
        .promise();
      const url = `https://coseonuberbucket12.s3.amazonaws.com/${objectName}`;
      return { url };
    } catch (error) {
      return null;
    }
  }
}
