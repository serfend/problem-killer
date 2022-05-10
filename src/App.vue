<template>
  <div id="app">
    <transition name="el-fade-in-linear">
      <router-view />
    </transition>
    <ClipboardMonitor />
    <Footer v-if="!$route.meta.hide_footer&&device!=='mobile'" />
  </div>
</template>

<script>
import ClipboardMonitor from '@/views/common/ClipboardMonitor'
import Footer from '@/views/welcome/Footer'
import { mapState } from 'vuex'
export default {
  name: 'App',
  components: { ClipboardMonitor, Footer },
  computed: {
    ...mapState({
      device: (state) => state.app.device,
    }),
  },
  mounted() {
    console.log(this.$route)
    this.show_tip()
  },
  methods: {
    show_tip() {
      const str =
        '\n          _____                    _____                    _____                    _____          \n         /\\    \\                  /\\    \\                  /\\    \\                  /\\    \\         \n        /::\\____\\                /::\\    \\                /::\\    \\                /::\\    \\        \n       /:::/    /                \\:::\\    \\              /::::\\    \\              /::::\\    \\       \n      /:::/    /                  \\:::\\    \\            /::::::\\    \\            /::::::\\    \\      \n     /:::/    /                    \\:::\\    \\          /:::/\\:::\\    \\          /:::/\\:::\\    \\     \n    /:::/____/                      \\:::\\    \\        /:::/__\\:::\\    \\        /:::/__\\:::\\    \\    \n   /::::\\    \\                      /::::\\    \\      /::::\\   \\:::\\    \\      /::::\\   \\:::\\    \\   \n  /::::::\\    \\   _____    ____    /::::::\\    \\    /::::::\\   \\:::\\    \\    /::::::\\   \\:::\\    \\  \n /:::/\\:::\\    \\ /\\    \\  /\\   \\  /:::/\\:::\\    \\  /:::/\\:::\\   \\:::\\____\\  /:::/\\:::\\   \\:::\\    \\ \n/:::/  \\:::\\    /::\\____\\/::\\   \\/:::/  \\:::\\____\\/:::/  \\:::\\   \\:::|    |/:::/__\\:::\\   \\:::\\____\\\n\\::/    \\:::\\  /:::/    /\\:::\\  /:::/    \\::/    /\\::/   |::::\\  /:::|____|\\:::\\   \\:::\\   \\::/    /\n \\/____/ \\:::\\/:::/    /  \\:::\\/:::/    / \\/____/  \\/____|:::::\\/:::/    /  \\:::\\   \\:::\\   \\/____/ \n          \\:2333:/    /    \\::::::/    /                 |:::::::::/    /    \\:::\\   \\:::\\    \\     \n           \\::::/    /      \\::::/____/                  |::|\\::::/    /      \\:::\\   \\:::\\____\\    \n           /:::/    /        \\:::\\    \\                  |::| \\::/____/        \\:::\\   \\::/    /    \n          /:::/    /          \\:::\\    \\                 |::|  v|               \\:::\\   \\/____/     \n         /:::/    /            \\:::\\    \\                |::|   |                \\:::\\    \\         \n        /:::/    /              \\:::\\____\\               \\::|   |                 \\:::\\____\\        \n        \\::/    /                \\::/    /                \\:|   |                  \\::/    /        \n         \\/____/                  \\/____/                  \\|___|                   \\/____/         \n\n想加入我们？发送简历到 serfend@foxmail.com，注明来自console'
      console.log(
        `%c${str}`,
        'color:#fff;background: linear-gradient(to right, #888cff, #885eaa, #aa4fa5)'
      )
    },
  },
}
</script>
