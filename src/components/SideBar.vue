<template>
  <div class="sidebar">
    <div>
      <ul>
        <li>   
          <router-link :to="{name: 'Dashboard'}"><font-awesome-icon icon="house-chimney" /><span>Dashboard</span></router-link>
        </li>
        <slot></slot>
        </ul>
    </div>
  </div>
</template>

<script>
export default {

}
</script>

<style>
.sidebar {
    padding-top: 50px;
    min-width: 350px;
    height: 100%;
    background-color: #272A3F;
    transition: 0.5s;
    transition-property: min-width font-size;
}

@media only screen and (max-width: 768px){
    .sidebar{
        min-width: 100px;
        font-size: 20px;
    }
    .sidebar span{
        display: none;
    }
}

.sidebar img {
    width: 150px;
    height: 150px;
    border-radius: 100px;
    margin-bottom: 10px;
}

.sidebar h5 {
    color: white;
    margin-bottom: 50px;
}

.sidebar ul {
    list-style-type: none;
    padding-left: 0px !important;
}

.sidebar a {
    text-decoration: none;
    display: block;
    color: white;
    font-size: 1.2em;
    width: 100%;
    padding-left: 70px;
    line-height: 60px;
    box-sizing: border-box;
    transition: 0.3s;
    transition-property: background;
}

.sidebar svg {
    color: white;
    margin-right: 10px;
}

.sidebar a:hover {
    background-color: #2F324C;
    color: white;
}

.sidebar .active {
    background-color: #363A59;
}
</style>