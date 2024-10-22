

const env = {
  DYNAMODB_QUESTION_TABLE: process.env.NEXT_PUBLIC_DYNAMODB_QUESTION_TABLE,
  DYNAMODB_REPLY_TABLE: process.env.NEXT_PUBLIC_DYNAMODB_REPLY_TABLE,
  S3_UPLOAD_BUCKET: process.env.NEXT_PUBLIC_S3_UPLOAD_BUCKET,
  S3_UPLOAD_BUCKET_PREFIX: process.env.NEXT_PUBLIC_S3_UPLOAD_BUCKET_PREFIX,
  DYNAMODB_QUESTION_TABLE_PARTITION: process.env.NEXT_PUBLIC_DYNAMODB_QUESTION_TABLE_PARTITION,
  AWS_REGION: process.env.NEXT_PUBLIC_AWS_REGION,
  S3_UPLOAD_BUCKET_URL: process.env.NEXT_PUBLIC_S3_UPLOAD_BUCKET_URL,
  AWS_ACCESS_KEY_ID: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID,
  AWS_SECRET_ACCESS_KEY: process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY,
};

// Validate that required environment variables are set
const requiredEnvs = [
  "DYNAMODB_QUESTION_TABLE",
  "DYNAMODB_REPLY_TABLE",
  "S3_UPLOAD_BUCKET",
  "AWS_REGION",
];

console.log(`check var ${process.env.DYNAMODB_QUESTION_TABLE}`)
requiredEnvs.forEach(key => {
  if (!env[key]) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
});

//Force String
for (const key in env) {
  if (env[key] === undefined) {
    env[key] = '';
  }
}

// Freeze the object to prevent modifications
const envConfig = Object.freeze(env);

export default envConfig;
