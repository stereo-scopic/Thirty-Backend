import { BadRequestException } from '@nestjs/common';
import * as AWS from 'aws-sdk';

export async function uploadFileOnAwsS3Bucket(file: any, directory: string) {
  AWS.config.update({
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY,
      secretAccessKey: process.env.AWS_SECRET_KEY,
    },
  });
  try {
    console.log('file', file);
    const upload = await new AWS.S3()
      .putObject({
        Key: `${directory}/${Date.now() + file.originalname}`,
        Body: file.buffer,
        Bucket: process.env.AWS_S3_BUCKET_NAME,
      })
      .promise();
    return `${process.env.AWS_S3_BUCKET_URL}/${directory}/${file.originalname}`;
  } catch (error) {
    // throw new BadRequestException(error);
    console.log(error);
  }
}
