<template>
  <q-page class="flex flex-center">
    <div class="column items-center q-gutter-md">
      <h3 class="text-h3">Welcome to the Diocese of Novaliches - Priest Directory</h3>
      <!-- <img
        alt="Diocese of Novaliches"
        src="https://catholink.ph/wp-content/uploads/2021/11/Diocese-of-Novaliches.png"
        style="width: 200px; height: 200px;"
      /> -->
      <q-input
        v-model="search"
        debounce="1000"
        filled
        placeholder="Search a Priest"
      >
        <template v-slot:append>
          <q-icon name="search" />
        </template>
      </q-input>
    </div>
  </q-page>
</template>