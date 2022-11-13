<template>
    <div class="error text-center">
        <span><slot></slot></span>   
    </div>
</template>

<script>
export default {
}
</script>

<style>
.error {
    background-color: #f5cfcf;
    padding: 10px;
}

.error span {
    color: #db3743;
    font-weight: 500;
}
</style>