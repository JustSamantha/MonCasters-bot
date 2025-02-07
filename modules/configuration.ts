import loadedConfig from "./../config/config.json"
import loadedSecretConfig from "./../config/secret.json";

export = { ...loadedConfig, ...loadedSecretConfig };