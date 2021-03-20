import AWS from "aws-sdk";

/* AWS Login */
AWS.config.update({
  credentials: {
    accessKeyId: process.env.AWS_KEY,
    secretAccessKey: process.env.AWS_SECRET,
  },
});

/* Upload Photo to AWS */
export const uploadPhoto = async (file, userId) => {
  const { filename, createReadStream } = await file;
  const readStream = createReadStream();
  const objectName = `${userId}-${Date.now()}-${filename}`;

  const { Location } = await new AWS.S3()
    .upload({
      Bucket: process.env.BUCKET_NAME, // bucket's name
      Key: objectName, // file name
      ACL: "public-read", // object's privacy
      Body: readStream, // file (stream)
    })
    .promise();

  return Location;
};
