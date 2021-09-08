<template>
  <template v-if="token">
    {{ token }}
  </template>
  <a
    class="button"
    v-else
    @click.prevent="modalOpen = true"
  >
    Log in

    <teleport to="#modals">
      <div
        v-if="modalOpen"
        style="outline: 1px solid blue;"
      >
        <button @click="modalOpen = false">
          Close
        </button>

        <form @submit.prevent="onSubmit">
          <label>
            Email:
            <input v-model="state.email" />
          </label>

          <label>
            Password:
            <input type="password" v-model="state.password" />
          </label>

          <button>
            Log In
          </button>
        </form>
      </div>
    </teleport>
  </a>
</template>

<script>
import { inject, ref, reactive } from 'vue';

export default {
  setup() {
    const login = inject('login');
    console.log(login);
    const token = inject('token');
    const modalOpen = ref(false);

    const state = reactive({
      email: '',
      password: '',
    });

    const onSubmit = () => {
      console.log(state);
      login(state.email, state.password)
        .then(() => console.log('success?'))
        .catch(() => console.log('failure'));
    };

    return {
      token,
      state,
      modalOpen,
      login,
      state,
      onSubmit,
    };
  },
};
</script>
