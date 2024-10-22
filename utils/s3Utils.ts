// utils/s3Utils.ts
'use client';
import {
  PutObjectCommand,
  S3Client,
  ListObjectsCommand,
  GetObjectCommand,
  S3ServiceException,
} from "@aws-sdk/client-s3";
import { S3Object, FileWithContent } from '@/types';
import envConfig from '@/static/global';

// Initialize DynamoDB DocumentClient
const region = "ap-northeast-2"
const accessKeyId = ''
const secretAccessKey = ''

const s3Client = new S3Client({
  region: region,
  credentials: {
      accessKeyId: accessKeyId,
      secretAccessKey: secretAccessKey,
  },
});

export const listFiles = async (bucket: string, prefix: string): Promise<S3Object[]> => {
  try {
      const command = new ListObjectsCommand({
          Bucket: bucket,
          Prefix: prefix,
          Delimiter: '/',
      });
      const data = await s3Client.send(command);

      if (data.Contents) {
          console.log("Success", data);
          return data.Contents.filter(item => item.Key !== undefined) as S3Object[];
      } else {
          console.log("No contents found");
          return [];
      }
  } catch (error) {
      console.error("Error fetching files: ", error);
      return [];
  }
};


export const uploadFileToS3 = async (file: File, fileName: string): Promise<string> => {
    try {
      // Step 1: Get the pre-signed URL from API
      const fileType = file.type; // Assuming file is defined in your context
      const filePrefix = envConfig.S3_UPLOAD_BUCKET_PREFIX ? envConfig.S3_UPLOAD_BUCKET_PREFIX : "";
      
      const url = new URL('api/signedurl', window.location.origin);
      url.searchParams.append('filename', fileName);
      url.searchParams.append('fileType', fileType);
      url.searchParams.append('filePrefix', filePrefix);
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error('Failed to get pre-signed URL');
      }
  
      const { presignedUrl, key, bucketName, region } = await response.json();
  
      // Step 2: Use the pre-signed URL to upload the file directly to S3
      const uploadResponse = await fetch(presignedUrl, {
        method: 'PUT',
        body: file,
        headers: {
          'Content-Type': file.type,
        },
      });
  
      if (!uploadResponse.ok) {
        throw new Error('Failed to upload file to S3');
      }
  
      // Construct and return the public URL of the uploaded file
      return `https://${bucketName}.s3.${region}.amazonaws.com/${key}`;
    } catch (error) {
      console.error('Error uploading file:', error);
      throw error;
    }
  };



