<template>
  <q-layout view="hHh lpR fFf">

    <q-header elevated class=" bg-white text-primary" height-hint="98" >
      <q-toolbar>
        <div class="flex items-center q-gutter-md">
         
         
        <q-toolbar-title style="color: #000075; font-weight: bold; font-size: 3rem; flex-direction: top;">

            <!-- <img src="https://catholink.ph/wp-content/uploads/2021/11/Diocese-of-Novaliches.png" alt="Diocese of Novaliches" style="width: 50px; height: 50px;"> -->
          DIOCESE OF NOVALICHES
        </q-toolbar-title>
        </div>
      </q-toolbar>
      

      <q-tabs align="left" style="background-color: #000047; color: white;">
        <q-route-tab to="/page1" label="SEARCH" />
        <q-route-tab to="/page2" label="PRIESTS" />
      </q-tabs>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>

  </q-layout>
</template>

<script>
import { defineComponent, } from 'vue'


export default defineComponent({
  name: 'MainLayout',

  components: {
  },

  data() {
    return {
    }
  },

  methods: {
  },
})
</script>
