import { b2 } from "../db";

export const uploadFileFromStreamUpload = async (file: Express.Multer.File, filename: string) => {
  const uploadUrlResponse = await b2.getUploadUrl({
    bucketId: process.env.BACKBLAZE_BUCKET_ID!,
  });

  const uploadUrl = uploadUrlResponse.data.uploadUrl;
  const uploadAuthToken = uploadUrlResponse.data.authorizationToken;

  const response = await b2.uploadFile({
    uploadUrl: uploadUrl,
    uploadAuthToken: uploadAuthToken,
    fileName: filename,
    data: file.buffer,
  });

  console.log(response.data);
};
