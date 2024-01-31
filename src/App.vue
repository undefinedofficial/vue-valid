<template>
  <form class="flex flex-col space-y-6" @submit.prevent="form.checkValid" @reset="form.reset">
    <div class="">
      <label for="password" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
        Password:
      </label>
      <input
        type="text"
        id="password"
        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        placeholder="Password"
        v-model="form.password.value"
      />
      <div v-if="form.password.isInvalid" class="text-red-500">
        <div v-if="form.password.errors.required">Password is required</div>
        <div v-if="form.password.errors.equal">Password is not equal</div>
      </div>
    </div>
    <div>
      <label> Confirm Password: </label>
      <input
        type="text"
        id="password"
        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        placeholder="Password"
        v-model="form.confirmPassword.value"
      />
      <div v-if="form.confirmPassword.isInvalid" class="text-red-500">
        <div v-if="form.confirmPassword.errors.required">Password is required</div>
        <div v-if="form.confirmPassword.errors.equal">Password is not equal</div>
      </div>
    </div>
    <div class="flex w-full">
      <button
        type="submit"
        class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
      >
        Submit
      </button>
      <button
        type="reset"
        class="text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800"
      >
        Reset
      </button>
    </div>
  </form>
</template>

<script lang="ts" setup>
import { equal, required, useForm } from "./validator";

const form = useForm({
  password: {
    initialValue: "",
    validators: {
      required,
    },
  },
  confirmPassword: {
    initialValue: "",
    validators: {
      required,
      equal: equal("password"),
    },
  },
});
</script>

<style lang="scss">
@tailwind base;
@layer base {
  html {
    -webkit-tap-highlight-color: transparent;
  }
}
@tailwind components;
@tailwind utilities;
</style>
