import app from "./app";

const requiredEnvVars = ["JWT_SECRET", "THIRDWEB_SECRET_KEY"];
for (const key of requiredEnvVars) {
  if (!process.env[key]) {
    console.error(`Missing required environment variable: ${key}`);
    process.exit(1);
  }
}

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
