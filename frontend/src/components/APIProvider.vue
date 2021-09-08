<template>
  <slot />
</template>

<script>
import { provide, readonly, ref } from 'vue';
import ky from 'ky';

export default {
  setup() {
    const token = ref('');

    const api = ky.create({
      prefixUrl: 'http://localhost:3000/',
    });

    const login = (name, pass) => {
      api.post('auth/token', { json: {
        name,
        password: pass,
      }})
        .json()
        .then((json) => {
          token.value = json.token;
          return json.token;
        })
    };

    provide('api', api);
    provide('login', login);
    provide('token', token);
  },
};
</script>
