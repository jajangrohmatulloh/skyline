const fs = require('fs');
const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config();

const envConfigFile = `export const environment = {
  production: ${process.env.NODE_ENV === 'production'},
  weatherApiKey: '${process.env.WEATHER_API_KEY}',
};
`;

const dirPath = './src/environments';
const targetPath = `${dirPath}/environment.ts`;

// Ensure directory exists
if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
}

// Write the configuration to the environment file
fs.writeFileSync(targetPath, envConfigFile, 'utf8');

console.log(`[pre-build] environment.ts generated successfully with dynamic API key.`);
