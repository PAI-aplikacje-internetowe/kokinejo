<template>
  <h1>{{ msg }}</h1>

</template>

<script>
// import {defineProps, reactive, defineComponent} from 'vue'

// module.export =
export default {

  name: "get-request",
  data() {
    return {
      msg: null
    };
  },
  created() {
    // this.msg = "dupa 123"
    fetch('http://localhost:3000/')
        .then(response => response.json())
        .then(data => (this.msg = data.powitanie))
        .catch(err => console.error(err));
  }
};


  // data() {
  //   return {
  //     msg: ""
  //   }
  // },
  // setup: () => {
  //   fetch('localhost:5000/', {
  //     method: 'GET', // *GET, POST, PUT, DELETE, etc.
  //     mode: 'same-origin', // no-cors, *cors, same-origin
  //     cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
  //     credentials: 'same-origin', // include, *same-origin, omit
  //     // headers: {
  //     //   'Content-Type': 'application/json'
  //     //   // 'Content-Type': 'application/x-www-form-urlencoded',
  //     // },
  //     redirect: 'follow', // manual, *follow, error
  //     referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
  //     // body: JSON.stringify(data) // body data type must match "Content-Type" h
  //   }).then(response => console.log(response))
  // },
// })
</script>
