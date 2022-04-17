<template>
<div class="container">
  <div class="form-container">
    <h1 class="text-center">Sign Up</h1>
    <form>
      <div class="form-group pb-3">
        <label for="username">Username:</label>
        <input v-model="username" type="text" id="username" placeholder="Enter username">
      </div>
      <div class="form-group pb-3">
        <label for="password">Password:</label>
        <input v-model="password" type="password" id="password" placeholder="Enter password">
      </div>
      <div class="form-group pb-3">
        <label for="account">Account Type:</label>
        <select v-model="accountType" id="account">
          <option value="student">Student</option>
          <option value="teacher">Teacher</option>
        </select>
      </div>
      <div class="text-center pt-3">
        <button type="submit" class="btn">Sign Up</button>
      </div>
    </form>
  </div>
</div>
</template>

<script>
export default {
}
</script>

<style>

</style>