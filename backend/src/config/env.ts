import "dotenv/config";
function getEnv (key: string): string {
    const value = process.env[key];
    if(!value){
        throw new Error(`${key} is missing`);

    }

    return value;
}

export const ENV= {
    PORT: getEnv("PORT"),
    MONGO_URI: getEnv("MONGO_URI")
}

