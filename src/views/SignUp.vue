<template>
<div class="container">
  <div class="form-container">
    <h1 class="text-center">Sign Up</h1>
    <form @submit.prevent="handleSubmit">
      <div class="form-group pb-2">
        <label for="username">Username:</label>
        <input v-model="username" type="text" class="form-control" id="username" placeholder="Enter username">
      </div>
      <div class="form-group pb-2">
        <label for="email">Email:</label>
        <input v-model="email" type="email" class="form-control" id="email" placeholder="Enter email">
      </div>
      <div class="d-flex w-100">
        <div class="flex-fill form-group pb-2">
          <label for="first_name">First Name:</label>
          <input v-model="first_name" type="text" class="form-control" id="first_name" placeholder="Enter first name">
        </div>
        <div class="flex-fill form-group pb-2 ms-2">
          <label for="last_name">Last Name:</label>
          <input v-model="last_name" type="text" class="form-control" id="last_name" placeholder="Enter last name">
        </div>
      </div>
      <div class="d-flex w-100">
        <div class="flex-fill form-group pb-2">
          <label for="password">Password:</label>
          <input v-model="password" type="password" class="form-control" id="password" placeholder="Enter password">
        </div>
        <div class="flex-fill form-group pb-2 ms-2">
          <label for="confirm_password">Confirm Password:</label>
          <input v-model="confirm_password" type="password" class="form-control" id="confirm_password" placeholder="Confirm password">
        </div>
      </div>
      <div class="form-group pb-2">
        <label for="account">Account Type:</label>
        <select v-model="accountType" class="form-control" id="account">
          <option value="" disabled selected>Select account type</option>
          <option value="0">Student</option>
          <option value="1">Teacher</option>
        </select>
      </div>
      <div class="text-center pt-2">
        <button type="submit" class="btn btn-main">Sign Up</button>
      </div>
    </form>
    <!-- <form @submit.prevent="handleSubmit">
      <div class="form-group pb-2">
        <label for="username">Username:</label>
        <input v-model="username" type="text" class="form-control" id="username" placeholder="Enter username">
      </div>
      <div class="form-group pb-2">
        <label for="email">Email:</label>
        <input v-model="email" type="email" class="form-control" id="email" placeholder="Enter email">
      </div>
      <div class="form-group pb-2">
        <label for="first_name">First Name::</label>
        <input v-model="first_name" type="text" class="form-control" id="first_name" placeholder="Enter first name">
      </div>
      <div class="form-group pb-2">
        <label for="last_name">Last Name:</label>
        <input v-model="last_name" type="text" class="form-control" id="last_name" placeholder="Enter last name">
      </div>
      <div class="form-group pb-2">
        <label for="password">Password:</label>
        <input v-model="password" type="password" class="form-control" id="password" placeholder="Enter password">
      </div>
      <div class="form-group pb-2">
        <label for="account">Account Type:</label>
        <select v-model="accountType" class="form-control" id="account">
          <option value="" disabled selected>Select account type</option>
          <option value="0">Student</option>
          <option value="1">Teacher</option>
        </select>
      </div>
      <div class="text-center pt-2">
        <button type="submit" class="btn btn-main">Sign Up</button>
      </div>
    </form> -->
  </div>
</div>
</template>

<script>
export default {
  data() {
    return {
      username: '',
      email: '',
      first_name: '',
      last_name: '',
      password: '',
      confirm_password: '',
      accountType: ''
    }
  },
  methods: {
    async handleSubmit() {
      const formData = new FormData();

      formData.append('username', this.username)
      formData.append('email', this.email)
      formData.append('full_name', this.first_name + " " + this.last_name)
      formData.append('is_superuser', false)
      formData.append('last_name', this.last_name)
      formData.append('first_name', this.first_name)
      if(this.accountType == 0) {
        formData.append('is_teacher', false)
        formData.append('is_student', true)
      } else {
        formData.append('is_teacher', true)
        formData.append('is_student', false)
      }
      formData.append('password', this.password)

      const data = {};
      formData.forEach((value, key) => (data[key] = value));

      try {
        const response = await fetch('http://localhost:8000/users/', {
          method: 'POST',
          credentials: 'include',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify(data)
        });
        const new_user = await response.json();
        console.log(new_user);
      } catch(e) {

      }
      // const response =
      //   fetch('http://localhost:8000/users/', {
			// 		method: 'POST',
			// 		credentials: 'include',
      //     headers: {'Content-Type': 'application/json'},
      //     body: JSON.stringify(data)
      //     })
      //     .then(res => res.json())
      //     .then(data => console.log(data))
      //     .catch(err => console.log(err))
      
    }
  }
}
</script>

<style scoped>
.form-container {
  padding: 40px 50px;
  min-width: 600px;
}
.form-container input {
    height: 40px;
}
</style>