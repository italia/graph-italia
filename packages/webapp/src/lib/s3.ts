import { nanoid } from "nanoid";
import {
  DeleteObjectCommand,
  GetObjectCommand,
  ListBucketsCommand,
  ListObjectsV2Command,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";

const { ENDPOINT, ACCESS_KEY_ID, ACCESS_KEY_SECRET, BUCKET_NAME } = process.env;

// This is the client we will use to deal with our S3 like service
const s3 = new S3Client({
  region: "auto",
  // region: process.env.S3_REGION as string,
  // forcePathStyle: true,
  endpoint: ENDPOINT as string,
  credentials: {
    accessKeyId: ACCESS_KEY_ID as string,
    secretAccessKey: ACCESS_KEY_SECRET as string,
  },
});
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import axios from "axios";
import { JsonObject } from '../../../server/lib/db/prisma/internal/prismaNamespace';

export function sleep(ms: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

export async function listBuckets() {
  let buckets = null;
  try {
    buckets = await s3.send(new ListBucketsCommand({}));
    console.log("buckets", buckets);
  } catch (error) {
    console.error("error", error);
  }
}

export async function uploadJSONFile(data: JsonObject) {
  const params = {
    forcePathStyle: true, // This is what made it work.
    Bucket: BUCKET_NAME as string,
    Key: "sample.json",
    Body: JSON.stringify(data),
    ContentType: "application/json",
  };
  // Upload file to S3
  const response = await s3.send(new PutObjectCommand(params));
  console.log("response", response);
}

export async function checkBucket() {
  let files = null;
  let urls = [];
  try {
    files = await s3.send(
      new ListObjectsV2Command({ Bucket: BUCKET_NAME as string })
    );

    if (files.Contents) {
      for (const file of files.Contents) {
        const url = await getSignedUrl(
          s3,
          new GetObjectCommand({
            Bucket: BUCKET_NAME as string,
            Key: file.Key,
          }),
          { expiresIn: 3600 }
        );
        urls.push(url);
      }
    }
  } catch (error) {
    console.error("error", error);
  }
  console.log("files", files);

  return { files, urls };
}

export async function getURl(docId: string) {
  const url = await getSignedUrl(
    s3,
    new GetObjectCommand({ Bucket: BUCKET_NAME, Key: docId }),
    { expiresIn: 3600 }
  );
  return url;
}

// This function will upload our document to the storage on a specific bucket
// and returns the id of the file on the S3
// (if you want to keep a track on them)
export async function createDocument({
  file,
  path,
  docId,
}: {
  file: File;
  path: string | number;
  docId: string;
}) {
  const uuid = nanoid();
  const fileData = Buffer.from(await file.arrayBuffer());
  const ext = file.name.split(".").pop() || "";
  const docName = `${uuid}.${ext}`;
  const key = `${path}/${docId}/${docName}`;
  const params = {
    Bucket: BUCKET_NAME as string,
    Key: key,
    ContentType: file.type,
  };

  // Upload file to S3
  let status = 500;
  let url = "";
  try {
    const putUrl = await getSignedUrl(s3, new PutObjectCommand(params));
    console.log("putUrl", putUrl);
    const response = await axios.put(putUrl, fileData, {
      headers: {
        "Content-Type": file.type,
      },
      maxBodyLength: Infinity,
      maxContentLength: Infinity,
      responseType: "json",
    });
    status = response.status;
    console.log("response", status);

    if (status == 200) {
      console.log("upload success", docId);
    }

    url = await getURl(docName);
  } catch (e) {
    console.log("ERROR");
    console.error(e);
  }

  return { docName, status, url, contentType: file.type, ext };
}

// This function will fetch the document data on the S3 given an ID and
// return a byte array (file content) with a content type
// might throw an exception if the file does not exist.
export const readDocument = async (
  docId: string
): Promise<{
  data: Uint8Array;
  contentType: string;
}> => {
  const readCommand = new GetObjectCommand({
    Bucket: BUCKET_NAME as string,
    Key: docId,
  });
  const object = await s3.send(readCommand);
  const byteArray = await object.Body?.transformToByteArray();
  if (byteArray === undefined) {
    throw new Error("File does not exist");
  }

  return {
    data: byteArray,
    contentType: object.ContentType ?? "application/octet-stream",
  };
};

// This function will delete the file on S3 given an ID
export const deleteDocument = async (
  docId: string,
): Promise<void> => {
  const deleteCommand = new DeleteObjectCommand({
    Bucket: BUCKET_NAME as string,
    Key: docId,
  });

  const res = await s3.send(deleteCommand);

  if (res.$metadata.httpStatusCode === 204) {
    //succes
    return
  }

  console.error("Error deleting bucket", res);
  throw new Error("Bucket not deleted");
};

// Helper to convert S3 streams to strings
export const streamToString = async (stream: any) => {
  const chunks = [];
  for await (const chunk of stream) {
    chunks.push(chunk);
  }
  return Buffer.concat(chunks).toString("utf-8");
};
