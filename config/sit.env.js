module.exports = {
  NODE_ENV: '"development"',
  ENV_CONFIG: '"sit"',
  BASE_API: '"http://www.allenyll.com:8088"',
  SSO_CONFIG: {
    AUTH_STATUS_URL: '"http://www.allenyll.com:8088/auth/getAuthStatus"',
    AUTH_URL: '"http://www.allenyll.com:8088/auth/authStatus"',
    GET_AUTH_URL: '"http://www.allenyll.com:8088/auth/doGet"',
    SSO_URL: '"http://www.allenyll.com:8088/auth/loginPage"',
    SSO_LOGOUT_URL: '"http://www.allenyll.com:8088/auth/logout?service=http://www.allenyll.com/#/dashboard"'
  }
}
