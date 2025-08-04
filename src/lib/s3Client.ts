// s3Client.ts
import { S3Client, GetObjectCommand, ListObjectsV2Command, _Object } from "@aws-sdk/client-s3";

// Initialize S3 client
const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

const BUCKET_NAME = process.env.S3_BUCKET_NAME!;
const BASE_PATH = process.env.S3_BASE_PATH!;

// Fetch a single file from S3
export async function fetchFileFromS3(key: string, userId?: string): Promise<string> {
  try {
    // Always use base path, add userId if provided
    const fullKey = userId ? `${BASE_PATH}${userId}/${key}` : `${BASE_PATH}${key}`;
    
    const command = new GetObjectCommand({
      Bucket: BUCKET_NAME,
      Key: fullKey,
    });

    const response = await s3Client.send(command);
    
    // Convert stream to string (for text files)
    const str = await response.Body!.transformToString();
    return str;
  } catch (error) {
    console.error('Error fetching file from S3:', error);
    throw error;
  }
}

// Fetch file as buffer (for binary files like images)
export async function fetchFileAsBuffer(key: string, userId?: string): Promise<Uint8Array> {
  try {
    const fullKey = userId ? `${BASE_PATH}${userId}/${key}` : `${BASE_PATH}${key}`;
    
    const command = new GetObjectCommand({
      Bucket: BUCKET_NAME,
      Key: fullKey,
    });

    const response = await s3Client.send(command);
    const buffer = await response.Body!.transformToByteArray();
    return buffer;
  } catch (error) {
    console.error('Error fetching file as buffer:', error);
    throw error;
  }
}

// List files in bucket or folder
export async function listFiles(prefix = '', userId?: string): Promise<_Object[]> {
  try {
    // Build the full prefix path
    let fullPrefix = BASE_PATH;
    if (userId) {
      fullPrefix += `${userId}/`;
    }
    if (prefix) {
      fullPrefix += prefix;
    }
    
    const command = new ListObjectsV2Command({
      Bucket: BUCKET_NAME,
      Prefix: fullPrefix,
    });

    const response = await s3Client.send(command);
    return response.Contents || [];
  } catch (error) {
    console.error('Error listing files:', error);
    throw error;
  }
}

// Generate a signed URL for temporary access
export async function generateSignedUrl(key: string, userId?: string, expiresIn = 3600): Promise<string> {
  try {
    const { getSignedUrl } = await import("@aws-sdk/s3-request-presigner");
    
    const fullKey = userId ? `${BASE_PATH}${userId}/${key}` : `${BASE_PATH}${key}`;
    
    const command = new GetObjectCommand({
      Bucket: BUCKET_NAME,
      Key: fullKey,
    });

    const signedUrl = await getSignedUrl(s3Client, command, { expiresIn });
    return signedUrl;
  } catch (error) {
    console.error('Error generating signed URL:', error);
    throw error;
  }
}

// Example usage functions
export async function downloadFile(key: string, localPath: string, userId?: string): Promise<void> {
  try {
    const buffer = await fetchFileAsBuffer(key, userId);
    const fs = await import('fs');
    fs.writeFileSync(localPath, buffer);
    console.log(`File downloaded to ${localPath}`);
  } catch (error) {
    console.error('Error downloading file:', error);
    throw error;
  }
}