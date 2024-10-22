// utils/s3Utils.ts
'use server';
import {
  S3Client,
  DeleteObjectCommand
} from "@aws-sdk/client-s3";
import envConfig from '@/static/global';

// Initialize DynamoDB DocumentClient
const region = envConfig.AWS_REGION ? envConfig.AWS_REGION : "";
const accessKeyId = envConfig.AWS_ACCESS_KEY_ID ? envConfig.AWS_ACCESS_KEY_ID : "";
const secretAccessKey = process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY ? process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY : "";

const s3Client = new S3Client({
  region: region,
  credentials: {
      accessKeyId: accessKeyId,
      secretAccessKey: secretAccessKey,
  },
});

// Function to delete a file
export const deleteFile = async (bucket: string, key: string): Promise<boolean> => {
  try {
      const command = new DeleteObjectCommand({
          Bucket: bucket,
          Key: key,
      });
      await s3Client.send(command);
      console.log(`Successfully deleted ${key} from ${bucket}`);
      return true;
  } catch (error) {
      console.error("Error deleting file: ", error);
      return false;
  }
};





