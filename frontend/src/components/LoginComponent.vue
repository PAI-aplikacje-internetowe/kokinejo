<template>

  <section v-if="isLoggedIn" class="section is-align-self-center">
    <h1 class="title">You are already logged in!</h1>
  </section>

  <section v-else class="section is-align-self-center">

    <h1 class="title">Log in</h1>

    <p
        v-if="successMessage"
    >
      {{ successMessage }}
    </p>
    <form
        v-else
        id="login"
        v-bind="$attrs"
        @submit.prevent="onSubmit"
    >
      <p
          v-if="errors.length"
          class="notification is-danger"
      >
        <template
            v-for="error in errors"
            :key="error"
        >
          {{ error }}<br>
        </template>
      </p>
      <fieldset
          :disabled="isSubmitting == true"
      >
        <div class="field is-horizontal">
          <div class="field-label is-normal">
            <label class="label">Username</label>
          </div>
          <div class="field-body">
            <div class="field">
              <div
                  class="control has-icons-left"
                  :class="{ 'has-icons-right': nameError.length }"
              >
                <input
                    v-model="name"
                    class="input"
                    :class="{ 'is-danger': nameError.length }"
                    type="text"
                    required="required"
                    placeholder="Username"
                >
                <span class="icon is-small is-left">
								<UserIcon/>
							</span>
                <span
                    v-if="nameError.length"
                    class="icon is-small is-right"
                >
								<ExclamationIcon/>
							</span>
              </div>
              <p
                  v-for="message in nameError"
                  :key="message"
                  class="help is-danger"
              >
                {{ message }}
              </p>
            </div>
          </div>
        </div>

        <div class="field is-horizontal">
          <div class="field-label is-normal">
            <label class="label">Password</label>
          </div>
          <div class="field-body">
            <div class="field">
              <div
                  class="control has-icons-left"
                  :class="{ 'has-icons-right': passwordError.length }"
              >
                <input
                    v-model="password"
                    class="input"
                    :class="{ 'is-danger': passwordError.length }"
                    type="password"
                    required="required"
                    placeholder="Password"
                >
                <span class="icon is-small is-left">
								<LockClosedIcon/>
							</span>
                <span
                    v-if="passwordError.length"
                    class="icon is-small is-right"
                >
								<ExclamationIcon/>
							</span>
              </div>
              <p
                  v-for="message in passwordError"
                  :key="message"
                  class="help is-danger"
              >
                {{ message }}
              </p>
            </div>
          </div>
        </div>

        <div class="field is-horizontal">
          <div class="field-label">
            <!-- Left empty for spacing -->
          </div>
          <div class="field-body">
            <p class="field control">
              <button
                  class="button is-primary"
                  :class="{ 'is-loading': isSubmitting }"
              >
							<span>
								Login
							</span>
              </button>
            </p>
          </div>
        </div>
      </fieldset>
    </form>
  </section>
</template>

<script>
import {computed, defineComponent, inject, ref} from 'vue';
import {useForm, useField} from 'vee-validate';
import {useStore} from 'vuex';
import {useRouter} from 'vue-router';
import {
  object as yObject,
  string as yString,
} from 'yup';
import {
  ExclamationIcon,
  MailIcon,
  LockClosedIcon,
  UserIcon,
} from '@heroicons/vue/outline';
import {get} from "../fetchUtils";

export default defineComponent({
  components: {
    ExclamationIcon,
    MailIcon,
    LockClosedIcon,
    UserIcon,
  },
  setup() {
    const schema = yObject({
      name: yString()
          .required('Username is required'),
      password: yString()
          .required('Password is required'),
    });

    const {handleSubmit, isSubmitting} = useForm({
      validationSchema: schema,
    });

    const {value: name, errors: nameError} = useField('name');
    const {value: password, errors: passwordError} = useField('password');


    const successMessage = ref('');
    const errors = ref([]);
    const isLoggedIn = computed(() => !!store.state.token)

    const ENDPOINT_TOKEN = inject('ENDPOINT_TOKEN');
    const ENDPOINT_ME = inject('ENDPOINT_AUTH_ME');

    const store = useStore();
    const router = useRouter();

    const onSubmit = handleSubmit(async (values) => {
      errors.value = [];

      const response = await fetch(ENDPOINT_TOKEN, {
        method: 'POST',
        headers: {
          Accept: 'application/json,',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });
      const responseData = await response.json();

      if (response.ok) {
        successMessage.value = responseData.message;
        store.commit('setToken', responseData.token);
        get(ENDPOINT_ME)
            .then(response => response.json())
            .then(data => store.commit('setMyData', data));
        await router.push('/');
        return;
      }
      errors.value.push(responseData.error);
    });

    return {
      successMessage,
      errors,
      isSubmitting,
      name,
      nameError,
      password,
      passwordError,
      onSubmit,
      isLoggedIn,
    };
  },
});
</script>
