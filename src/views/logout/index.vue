<template>
  <div class="login-container"/>
</template>

<script>

export default {
  name: 'Logout',
  data() {
  },
  watch: {
  },
  created() {
    this.logout()
    // window.addEventListener('hashchange', this.afterQRScan)
  },
  destroyed() {
    // window.removeEventListener('hashchange', this.afterQRScan)
  },
  methods: {
    logout() {
      this.$store.dispatch('FedLogOut').then(() => {
        location.reload()// In order to re-instantiate the vue-router object to avoid bugs
      })
    }
  }
}
</script>

