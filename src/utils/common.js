export function getAuthUrl() {
  const service = window.encodeURIComponent(process.env.SSO_CONFIG.AUTH_STATUS_URL + '?target=' + window.encodeURIComponent(window.location.href))
  return process.env.SSO_CONFIG.SSO_URL + '?from=' + service
}
