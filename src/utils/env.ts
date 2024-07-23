import "dotenv/config"

export default function getEnvVar(key: string){
    const val = process.env[key]
    if(!val){
        throw new Error(`Environment variable is not set for ${key}`)
    }
    return val
}