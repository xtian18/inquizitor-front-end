<template>
  <nav class="navbar navbar-expand navbar-dark">
    <div class="container">
        <router-link :to="{name: 'Home'}" class="navbar-brand" aria-current="page">LOGO</router-link>
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
    background-color: #2d283e;
}

.navbar-nav .active {
    background-color: #564f6f;
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

</style>