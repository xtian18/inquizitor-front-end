<template>
  <div class="sidebar">
    <div>
      <slot name="sidebar-profile"></slot>
      <ul>
        <li>   
          <router-link :to="{name: 'Dashboard'}"><font-awesome-icon icon="house-chimney" /><span>Dashboard</span></router-link>
        </li>
        <slot name="sidebar-items"></slot>
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

.sidebar .profile img {
    width: 150px;
    height: 150px;
    border-radius: 50%;
    margin-bottom: 10px;
    border: 8px solid #FFFFFF;
}

.sidebar .profile h5 {
    color: white;
    margin-bottom: -5px;
}

.sidebar .profile span {
    color: white;
    font-size: 0.9em;
}

.sidebar .profile {
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
@media only screen and (max-width: 768px){
    .sidebar{
        min-width: 80px;
        font-size: 20px;
    }
    .sidebar span{
        display: none;
    }
    .sidebar .profile {
        display: none;
    }
}
</style>