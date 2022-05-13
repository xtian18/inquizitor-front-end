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
    background-color: #efb5b5;
    padding: 2px;
    border: 1px solid #740505;
    border-radius: 5px;
}

.error p {
    color: #740505;
    font-weight: 600;
}
</style>