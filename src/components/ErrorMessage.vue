<template>
    <div class="error">
        <p class="text-center"><slot></slot></p>   
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
    /* border: 1px solid #740505; */
    /* border-radius: 5px; */
}

.error p {
    color: #db3743;
    font-weight: 500;
}
</style>