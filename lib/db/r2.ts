import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

// Ensure environment variables are loaded
const accountId = process.env.R2_ACCOUNT_ID;
const accessKeyId = process.env.R2_ACCESS_KEY_ID;
const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;
const bucketName = process.env.R2_BUCKET_NAME;
const publicUrl = process.env.NEXT_PUBLIC_R2_PUBLIC_URL;

const s3Client = new S3Client({
  region: "auto",
  endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: accessKeyId || "",
    secretAccessKey: secretAccessKey || "",
  },
});

export async function uploadImageToR2(file: File, folder: string = "products"): Promise<{ url: string; key: string }> {
  if (!accountId || !accessKeyId || !secretAccessKey) {
    throw new Error("R2 Credentials are not configured in environment variables.");
  }

  // Generate a unique filename to prevent overwrites
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const extension = file.name.split('.').pop()?.toLowerCase() || 'jpg';
  const uniqueId = crypto.randomUUID();
  const fileKey = `${folder}/${uniqueId}.${extension}`;

  const command = new PutObjectCommand({
    Bucket: bucketName,
    Key: fileKey,
    Body: buffer,
    ContentType: file.type,
  });

  await s3Client.send(command);

  // Return both the public URL for rendering and the internal key for DB storage
  return {
    url: `${publicUrl}/${fileKey}`,
    key: fileKey,
  };
}
