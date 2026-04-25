const SENSITIVE_KEY_PATTERN = /(name|tax|document|passport|nie|email|range|customer)/i;

export function recordOperationalEvent(eventName, metadata = {}) {
  const safeMetadata = Object.fromEntries(
    Object.entries(metadata).filter(([key, value]) => !SENSITIVE_KEY_PATTERN.test(key) && value !== undefined),
  );

  console.log(`[regla183] ${eventName}`, safeMetadata);
}

export function recordOperationalError(eventName, error, metadata = {}) {
  recordOperationalEvent(eventName, {
    ...metadata,
    errorType: error instanceof Error ? error.name : typeof error,
    errorCode: error?.code,
    errorMessage: error instanceof Error ? error.message : undefined,
  });
}
