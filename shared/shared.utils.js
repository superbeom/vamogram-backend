import AWS from "aws-sdk";

/* AWS Login */
AWS.config.update({
  credentials: {
    accessKeyId: process.env.AWS_KEY,
    secretAccessKey: process.env.AWS_SECRET,
  },
});

/* Upload Photo to AWS */
export const uploadToS3 = async (file, userId, folderName) => {
  try {
    const { filename, createReadStream } = await file;
    const readStream = createReadStream();
    const objectName = `${folderName}/${userId}-${Date.now()}-${filename}`;

    const { Location } = await new AWS.S3()
      .upload({
        Bucket: process.env.BUCKET_NAME, // bucket's name
        Key: objectName, // file name
        ACL: "public-read", // object's privacy
        Body: readStream, // file (stream)
      })
      .promise();

    return Location;
  } catch (error) {
    console.log("Error @uploadToS3_shared.utils: ", error.message);

    return null;
  }
};
