<template>
    <div class="modal" :class="{ 'is-active': active }">
    <div class="modal-background"></div>
    <div class="modal-card">
      <header class="modal-card-head">
        <p class="modal-card-title">Modal title</p>
        <button class="delete" aria-label="close" @click="closeMe"></button>
      </header>
      <section class="modal-card-body">
        <!-- Content ... -->
      </section>
      <footer class="modal-card-foot">
        <button class="button is-success">Save changes</button>
        <button class="button">Cancel</button>
      </footer>
    </div>
  </div>

</template>

<script>
import {defineComponent} from "vue";

export default defineComponent({
  name: 'GameInfoModal',
  props: ['active'],
  methods: {
    closeMe() {
      this.$emit('info-close');
    }
  }
})

</script>
