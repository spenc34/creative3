var app = new Vue({
  el: '#app',
  data: {
    currentNumber: 0,
    question: '',
    type: '',
    correctAnswer: '',
    answers: [],
    numCorrect: 0,
    loading: false,
    loaded: false,
    answered: false,
    message: '',
    done: false,
    questions: {},
  },
  methods: {
    getQuestions: function() {
      this.loading = true;
      fetch('https://opentdb.com/api.php?amount=10&category=9&encode=base64').then(response => {
        return response.json();
      }).then(json => {
        this.questions = json.results;

        this.getNextQuestion();
        this.loading = false;
        this.loaded = true;
        return true;
      }).catch(err => {
        console.log(err);
      });
    },
    getNextQuestion: function() {
      var question = this.questions[this.currentNumber];
      this.type = atob(question.type);
      this.question = atob(question.question);
      this.correctAnswer = atob(question.correct_answer);

      for (var i = 0; i < question.incorrect_answers.length; i++) {
        this.answers.push(atob(question.incorrect_answers[i]));
      }
      this.answers.push(this.correctAnswer);

      if (this.type === 'multiple') {
        this.shuffleAnswers();
      }
    },
    shuffleAnswers: function() {
      for (var i = 0; i < this.answers.length; i++) {
        var randomIndex = Math.floor(Math.random() * this.answers.length);
        var temp = this.answers[i];
        this.answers[i] = this.answers[randomIndex];
        this.answers[randomIndex] = temp;
      }
    },
    highlightCorrectAnswer: function() {
      for (var i = 0; i < this.answers.length; i++) {
        if (this.answers[i] === this.correctAnswer) {
          var id = 'button' + (i + 1);
          var button = document.getElementById(id);
          button.style.backgroundColor = "green";
          button.style.color = "white";
          return;
        }
      }
    },
    wasAnswerRight: function(index) {
      return this.answers[index] === this.correctAnswer;
    },
    checkAnswer: function(number) {

      if (this.answered)
        return;

      this.answered = true;
      var right = this.wasAnswerRight(number-1);

      this.highlightCorrectAnswer();

      if (right) {
        this.numCorrect++;
      } else {
        var button = document.getElementById('button' + number);
        button.style.backgroundColor = "red";
        button.style.color = "white";
      }

      this.currentNumber++;

      if (this.currentNumber === 10) {
        this.finishGame();
        return;
      }
    },
    button1Pressed: function() {
      this.checkAnswer(1);
    },
    button2Pressed: function() {
      this.checkAnswer(2);
    },
    button3Pressed: function() {
      this.checkAnswer(3);
    },
    button4Pressed: function() {
      this.checkAnswer(4);
    },
    truePressed: function() {
      if (this.answered)
        return;
      if (this.correctAnswer === 'True') {
        var button = document.getElementById('trueButton');
        button.style.backgroundColor = "green";
        button.style.color = "white";
        this.numCorrect++;

      } else {
        var button = document.getElementById('trueButton');
        button.style.backgroundColor = "red";
        button.style.color = "white";

        button = document.getElementById('falseButton');
        button.style.backgroundColor = "green";
        button.style.color = "white";
      }
      this.answered = true;
      this.currentNumber++;
      if (this.currentNumber === 10) {
        this.finishGame();
        return;
      }
    },
    falsePressed: function() {
      if (this.answered)
        return;

      if (this.correctAnswer === 'False') {
        var button = document.getElementById('falseButton');
        button.style.backgroundColor = "green";
        button.style.color = "white";
        this.numCorrect++;

      } else {
        var button = document.getElementById('falseButton');
        button.style.backgroundColor = "red";
        button.style.color = "white";

        button = document.getElementById('trueButton');
        button.style.backgroundColor = "green";
        button.style.color = "white";
      }
      this.answered = true;
      this.currentNumber++;
      if (this.currentNumber === 10) {
        this.finishGame();
        return;
      }
    },
    resetQuestion: function() {
      this.answered = false;
      this.answers = [];

      for (var i = 1; i <= 4; i++) {
        var button = document.getElementById('button' + i);
        this.resetButtonAppearance(button);
      }

      this.resetButtonAppearance(document.getElementById('falseButton'));
      this.resetButtonAppearance(document.getElementById('trueButton'));

      this.getNextQuestion();

    },
    resetButtonAppearance(button) {
      if (button === null)
        return;
      button.style.backgroundColor = "#f8f9fa";
      button.style.color = "#212529";
    },
    finishGame: function() {
      console.log('game done');
      this.done = true;
      if (this.numCorrect < 3) {
        this.message = "You're not very good at this, are you?";
      } else if (this.numCorrect < 5) {
        this.message = "Better luck next time!";
      } else if (this.numCorrect < 7) {
        this.message = "Not bad!";
      } else if (this.numCorrect < 9) {
        this.message = "Great job!"
      } else {
        this.message = "Perfect!";
      }
    },
    playAgain: function() {
      this.currentNumber = 0;
      this.numCorrect = 0;
      this.done = false;
      message = '';
      this.resetQuestion();
      this.getQuestions();

    }
  }

})
