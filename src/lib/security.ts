const blockedPathPatterns = [
  /^\/\.env(?:\/|$)/i,
  /^\/\.git(?:\/|$)/i,
  /^\/wp-admin(?:\/|$)/i,
  /^\/wp-login\.php$/i,
  /^\/xmlrpc\.php$/i,
  /^\/phpmyadmin(?:\/|$)/i,
  /^\/adminer(?:\/|$)/i,
];

const scannerUserAgentPattern = /sqlmap|nikto|acunetix|masscan|zgrab/i;

export function isBlockedProbePath(pathname: string) {
  return blockedPathPatterns.some((pattern) => pattern.test(pathname));
}

export function isScannerUserAgent(userAgent: string | null) {
  return scannerUserAgentPattern.test(userAgent ?? "");
}
