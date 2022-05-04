<template>

  <form class="card auth-card" v-on:submit.prevent="login" method="post">
    <div class="card-content">
      <span class="card-title">Панель Управления</span>
      <div class="input-field">
        <input
            v-model="username"
            id="email"
            type="text"
            class="validate"
        >
        <label for="email">Логин</label>
        <small class="helper-text invalid">Логин</small>
      </div>
      <div class="input-field">
        <input
            v-model="password"
            id="password"
            type="password"
            class="validate"
        >
        <label for="password">Пароль</label>
        <small class="helper-text invalid">Пароль</small>
      </div>
      <div class="input-field">
        <small class="helper-text invalid">{{ ErrorResponse }}</small>
      </div>
    </div>

    <div class="card-action">
      <div>
        <button
            class="btn waves-effect waves-light auth-submit"
            type="submit"
        >
          Войти
          <i class="material-icons right">send</i>
        </button>
      </div>

      <p class="center">
        Нет аккаунта?
        <a href="/">Зарегистрироваться</a>
      </p>
    </div>
  </form>
</template>

<script>
import {mapActions, mapGetters} from "vuex"

export default {
  name: "Login",
  data() {
    return {
      "username": "",
      "password": "",
    }
  },
  computed: {
    ...mapGetters([
      "LoginResponse",
      "ErrorResponse"
    ])
  },
  methods: {
    ...mapActions([
      "loginAction",
      "getTest"
    ]),
    login() {
      this.loginAction({username: this.username, password: this.password});
      // eslint-disable-next-line no-empty
      console.log("error response", this.ErrorResponse)
      if (this.ErrorResponse.length > 0) {
        this.$router.push({"name": "home"})
      }
    }
  },

}
</script>

<style scoped>

</style>