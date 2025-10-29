const questions = [
    {
          
       question: "Which is largest animal in the world?",
       answers: [
           { text: "Shark", correct: false},
           { text: "Blue whale", correct: true},
           { text: "Elephant", correct: false},
           { text: "Giraffe", correct: false},   
        ]
    },

    {
          
       question: "Which is the smallest country in the world?",
       answers: [
           { text: "Vatican", correct: true},
           { text: "Bhutan", correct: false},
           { text: "Nepal", correct: false},
           { text: "Shri Lanka", correct: false},   
        ]
    },

    {
          
       question: "Which is the largest desert in the world?",
       answers: [
           { text: "Kalahari", correct: false},
           { text: "Gobi", correct: false},
           { text: "Sahara", correct: false},
           { text: "Antarctica", correct: true},   
        ]
    },

    {
          
       question: "Which is the smallest continent in the world?",
       answers: [
           { text: "Asia", correct: false},
           { text: "Australia", correct: true},
           { text: "Arctic", correct: false},
           { text: "Africa", correct: false},   
        ]
    },

    {
          
       question: "Who is the father of HTML?",
       answers: [
           { text: "Rasmus Lerdorf", correct: false},
           { text: "Tim Berners-Lee", correct: true},
           { text: "Brendan Eich", correct: false},
           { text: "Sergey Brin", correct: false},   
        ]
    },

    {
          
       question: "What is the correct syntax of doctype in HTML5?",
       answers: [
           { text: "doctype html", correct: false},
           { text: "doctype html", correct: false},
           { text: "doctype html!", correct: false},
           { text: "!doctype html", correct: true},   
        ]
    },

    {
          
       question: "In which part of the HTML metadata is contained?",
       answers: [
           { text: "head tag", correct: true},
           { text: "title tag", correct: false},
           { text: "html tag", correct: false},
           { text: "body tag", correct: false},   
        ]
    },

    {
          
       question: "CSS stands for __________?",
       answers: [
           { text: "Color Style Sheets", correct: false},
           { text: "Cascade Sheets Style", correct: false},
           { text: "Cascade Style Sheet", correct: false},
           { text: "Cascading Style Sheets", correct: true},   
        ]
    },

    {
          
       question: "In CSS, “font-size” can be called as ________?",
       answers: [
           { text: "Selector", correct: false},
           { text: "Rule", correct: false},
           { text: "Property", correct: false},
           { text: "Property-Name", correct: true},   
        ]
    },

    {
          
       question: "Which of the following is not javascript data types?",
       answers: [
           { text: "Null type", correct: false},
           { text: "Undefined type", correct: false},
           { text: "Number type", correct: false},
           { text: "All of the mentioned", correct: true},   
        ]
    }
];

const questionElement = document.getElementById("question");
const answerButtons = document.getElementById("answer-buttons");
const nextButton = document.getElementById("next-btn");

let currentQuestionIndex = 0;
let score = 0;

function startQuize() {
    currentQuestionIndex = 0;
    score = 0;
    nextButton.innerHTML = "Next";
    showQuestion();
}

function showQuestion() {
    resetState();
    let currentQuestion = questions[currentQuestionIndex];
    let questionNo = currentQuestionIndex + 1;
    questionElement.innerHTML = questionNo + ". " + currentQuestion.question;

    currentQuestion.answers.forEach(answer => {
        const button = document.createElement("button");
        button.innerHTML = answer.text;
        button.classList.add("btn");
        answerButtons.appendChild(button);
        if(answer.correct) {
            button.dataset.correct = answer.correct;
        }
        button.addEventListener("click", selectAnswer);
    });
}

function resetState() {
     nextButton.style.display = "none";
     while(answerButtons.firstChild){
          answerButtons.removeChild(answerButtons.firstChild);
     }

}

function selectAnswer(e) {
    const selectedBtn = e.target;
    const isCorrect = selectedBtn.dataset.correct === "true";
    if(isCorrect) {
        selectedBtn.classList.add("correct");
        score++;
    }else{
        selectedBtn.classList.add("incorrect");
    }
    Array.from(answerButtons.children).forEach(button => {
        if(button.dataset.correct === "true") {
            button.classList.add("correct");
        }
        button.disabled = true;
    });
    nextButton.style.display = "block";
}

function showScore() {
    resetState();
    questionElement.innerHTML = `You scored ${score} out of ${questions.length}!`;
    nextButton.innerHTML = "Play Again";
    nextButton.style.display = "block";
}

function handleNextButton() {
    currentQuestionIndex++;
    if(currentQuestionIndex < questions.length) {
        showQuestion();
    }else{
        showScore();
    }

}

nextButton.addEventListener("click", () => {
    if(currentQuestionIndex < questions.length) {
        handleNextButton();
    }else{
        startQuize();
    }
});


startQuize();

/********* Stop!***************** */