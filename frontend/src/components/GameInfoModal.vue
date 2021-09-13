<template>
    <div class="modal" :class="{ 'is-active': active }">
    <div class="modal-background"></div>
    <div class="modal-card">
      <header class="modal-card-head">
        <p class="modal-card-title">{{ gameName }}</p>
        <button class="delete" aria-label="close" @click="closeMe"></button>
      </header>
      <section class="modal-card-body">
        {{ description }}
      </section>
    </div>
  </div>

</template>

<script>
import {defineComponent} from "vue";

export default defineComponent({
  name: 'GameInfoModal',
  props: ['active', 'gameName', 'description'],
  methods: {
    closeMe() {
      this.$emit('info-close');
    }
  }
})

</script>
