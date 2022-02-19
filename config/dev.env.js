module.exports = {
  NODE_ENV: '"development"',
  ENV_CONFIG: '"dev"',
  BASE_API: '"http://localhost:8088"',
  SSO_CONFIG: {
    AUTH_STATUS_URL: '"http://localhost:8088/auth/getAuthStatus"',
    AUTH_URL: '"http://localhost:8088/auth/authStatus"',
    GET_AUTH_URL: '"http://localhost:8088/auth/doGet"',
    SSO_URL: '"http://localhost:8088/auth/loginPage"',
    SSO_LOGOUT_URL: '"http://localhost:8088/auth/logout?service=http://localhost:8888/#/dashboard"'
  }
}
