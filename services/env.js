const DEFAULTS = {
  nodeEnv: "development",
  port: 4000,
  openRouterBaseUrl: "https://openrouter.ai/api/v1",
  openRouterModel: "mistralai/mistral-7b-instruct",
};

function isValidMongoUri(uri) {
  try {
    const parsed = new URL(uri);
    return parsed.protocol === "mongodb:" || parsed.protocol === "mongodb+srv:";
  } catch {
    return false;
  }
}

function parsePositiveInt(value, name, fallback, errors) {
  if (value == null || String(value).trim() === "") {
    return fallback;
  }
  const parsed = Number.parseInt(String(value), 10);
  if (Number.isNaN(parsed) || parsed <= 0) {
    errors.push(`${name} must be a positive integer.`);
    return fallback;
  }
  return parsed;
}

export function getServerEnv(env) {
  const errors = [];
  const mongoUri = (env.MONGODB_URI ?? "").trim();
  const dbName = (env.MONGODB_DB ?? "").trim();
  const jwtSecret = (env.JWT_SECRET ?? "").trim();
  const nodeEnv = (env.NODE_ENV ?? DEFAULTS.nodeEnv).trim() || DEFAULTS.nodeEnv;
  const port = parsePositiveInt(env.PORT, "PORT", DEFAULTS.port, errors);

  if (!mongoUri) {
    errors.push("MONGODB_URI is required.");
  } else if (!isValidMongoUri(mongoUri)) {
    errors.push("MONGODB_URI must start with mongodb:// or mongodb+srv://.");
  }

  if (!dbName) {
    errors.push("MONGODB_DB is required.");
  }

  if (!jwtSecret) {
    errors.push("JWT_SECRET is required.");
  }

  if (errors.length) {
    throw new Error(`Environment validation failed:\n- ${errors.join("\n- ")}`);
  }

  return {
    mongoUri,
    dbName,
    jwtSecret,
    nodeEnv,
    port,
    openRouterApiKey: (env.OPENROUTER_API_KEY ?? "").trim(),
    openRouterModel: (env.OPENROUTER_MODEL ?? DEFAULTS.openRouterModel).trim(),
    openRouterBaseUrl: (env.OPENROUTER_BASE_URL ?? DEFAULTS.openRouterBaseUrl).trim(),
    openRouterAppName: (env.OPENROUTER_APP_NAME ?? "AetherLMS").trim(),
    openRouterAppUrl: (env.OPENROUTER_APP_URL ?? "").trim(),
    adminAccessCode: (env.ADMIN_ACCESS_CODE ?? "").trim(),
  };
}
