<template>
    <div class="container">
        <div class="titlebox">
            <h1>Instructions for quiz:</h1>
        </div>

        <div class="instructionbox">
            <p> Choose the best answer for each question. Strictly, do not leave the quiz
                tab until you have finished the quiz. Activities shall be monitored by the 
                system. Answer each questions carefully, no returning to previous items.</p>
        </div>

        <div>
            <!--Quiz Preface. Must connect to QuizTemplate-->
            <input type="submit" value="I understand." class="btn" id="quizbtn">
        </div>
    </div>
</template>

<style scoped>
    .titlebox{
        width: 80%;
        height: 20%;
    }

    .instructionbox{
        margin: auto;
        width: 500px;
        height: 200px;
        background-color: white;
        padding-top: 40px;
        padding-left: 30px;
        padding-right: 30px;
    }

    p{
        text-indent: 2em;
        margin: auto;
        display: block;
        text-align: justify;
     
    }

    #quizbtn{
        margin-top: 15px;
        margin-left: auto;
        margin-right: auto;
        margin-bottom: auto;
        display: block;
    }
</style>