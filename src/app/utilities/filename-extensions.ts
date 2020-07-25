export function getTimestampBasedFilename(extension: string, timestamp: Date = new Date(), extra?: string): string {
  const utcTimestamp = timestamp.getUTCDate();
  return `${timestamp.getUTCFullYear()}${(timestamp.getUTCMonth() + 1).toString().padStart(2, '0')}${(timestamp.getUTCDate()).toString().padStart(2, '0')}_${(timestamp.getUTCHours()).toString().padStart(2, '0')}${(timestamp.getUTCMinutes()).toString().padStart(2, '0')}${(timestamp.getUTCSeconds()).toString().padStart(2, '0')}${extra ? `_${extra}` : ''}${extension}`;
}
