<template>
    <div class="container">
        <div class="titlebox">
            <h1>Quiz Result:</h1>
        </div>

        <div class="resultbox">
            <h2 id="examname">Exam 1:</h2>
            <br>
            <h3 id="results">You got 25 out of 30 for this quiz!</h3>
        </div>
    </div>
</template>

<style scoped>
    .titlebox{
        width: 80%;
        height: 20%;
    }
    
    .resultbox{
        width: 500px;
        height: 200px;
        background-color: white;
        margin: auto;
        padding: auto;
        display: block;
        padding-top: 40px;
    }

    #examname{
        text-align: left;
        margin: auto;
        padding-left: 20px;
    }

    #results{
        color: green;
        text-align: center;

    }
</style>