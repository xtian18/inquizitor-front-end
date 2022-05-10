<template>
  <nav class="navbar navbar-expand navbar-dark">
    <div class="container">
        <router-link to="/" class="navbar-brand" aria-current="page"><img src="@/assets/logo.png" class="logo" alt=""></router-link>
        <div class="float-end" id="navbarNav">
            <slot></slot>
        </div>
    </div>
  </nav>
</template>

<script>
export default {

}
</script>

<style>
.navbar {
    background-color: #1F2233;
}

.navbar-nav .active {
    background-color: #363A59;
}

.nav-item {
  text-align: center;
  width: 80px;
}

/* .navbar-nav:hover {
    background-color: #564f6f;
} */

.nav-item a {
  color: white;
}

.logo {
  width: auto;
  height: 28px;
}
</style>