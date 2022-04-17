<template>
<div class="container">
    <!-- Div for title-->
    <div class="titlebox">
        <h1>Take Exam</h1>
    </div>

    <!-- Div for enter code box-->
    <div class="codebox">
        <h2 id="header">Enter exam code:</h2>
        <input type="text" id="textbox">
        <input type="submit" class="btn" id="submit" value="Enter">
    </div>
</div>
</template>

<style scoped>
    #header{
        margin-top: 20px;
        display: block;
        text-align: center;
    }

    .titlebox{
        width: 80%;
        height: 20%;
    }
    .codebox{
        width: 500px;
        height: 200px;
        background-color: white;
        margin: auto;
        padding: auto;
        display: block;
        padding: 3px;
    }

    #textbox{
        margin-top: 5px;
        margin-left: auto;
        margin-right: auto;
        display: block;
        border-radius: 5px;
        height: 40px;
        text-align: center;
        color: red;
        font-weight: bold;
    }

    #submit{
        margin-top: 15px;
        margin-left: auto;
        margin-right: auto;
        margin-bottom: auto;
        display: block;
    }
</style>
