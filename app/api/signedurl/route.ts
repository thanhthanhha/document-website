// app/api/signedurl/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import envConfig from '@/static/global'

const s3Client = new S3Client({
  region: envConfig.AWS_REGION,
  credentials: {
    accessKeyId: envConfig.AWS_ACCESS_KEY_ID!,
    secretAccessKey: envConfig.AWS_SECRET_ACCESS_KEY!,
  },
});

export async function GET(request: NextRequest) {
  console.log(`hellow from ${envConfig.AWS_REGION}`)
  try {
    // Extract query parameters
    const { searchParams } = new URL(request.url);
    const fileName = searchParams.get('filename');
    const fileType = searchParams.get('fileType');
    const filePrefix = searchParams.get('filePrefix');

    if (!fileName || !fileType || !filePrefix) {
      return NextResponse.json({ error: 'File name and type are required' }, { status: 400 });
    }

    const key = `${filePrefix}/${fileName}`;

    const command = new PutObjectCommand({
      Bucket: envConfig.S3_UPLOAD_BUCKET,
      Key: key,
      ContentType: fileType,
    });

    const presignedUrl = await getSignedUrl(s3Client, command, { expiresIn: 3600 }); // URL expires in 1 hour

    return NextResponse.json({ 
      presignedUrl,
      key,
      bucketName: envConfig.S3_UPLOAD_BUCKET,
      region: envConfig.AWS_REGION
    });
  } catch (error) {
    console.error('Error generating pre-signed URL:', error);
    return NextResponse.json({ error: 'Error generating pre-signed URL' }, { status: 500 });
  }
}