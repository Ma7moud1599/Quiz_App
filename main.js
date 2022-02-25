// select elements
let countSpan = document.querySelector(".count span");
let bullets = document.querySelector(".bullets");
let bulletsSpanContainer = document.querySelector(".bullets .spans");
let quizArea = document.querySelector(".quiz-area");
let answersArea = document.querySelector(".answers-area");
let submitButton = document.querySelector(".submit-button");
let resultsContainer = document.querySelector(".results");
let countdownElement = document.querySelector(".countdown");
// set options
let currentIndex = 0;
let rightAnswers = 0;

function getQuestions() {
  let myRequest = new XMLHttpRequest();

  myRequest.onreadystatechange = function () {
    if (this.readyState === 4 && this.status === 200) {
      let questionsObject = JSON.parse(this.responseText);
      let questionsCount = questionsObject.length;

      // create bullets + set count questions
      createBullets(questionsCount);

      // add questions data
      addQuestionData(questionsObject[currentIndex], questionsCount);

      // start countdown
      countDown(10, questionsCount);

      // click on submit
      submitButton.onclick = () => {
        let theRightAnswer = questionsObject[currentIndex].right_answer;
        console.log(theRightAnswer);

        // increase index
        currentIndex++;

        // check the answer
        checkAnswer(theRightAnswer, questionsCount);

        // remove privous questions
        quizArea.innerHTML = "";
        answersArea.innerHTML = "";

        // add questions data
        addQuestionData(questionsObject[currentIndex], questionsCount);

        // handle bullets class
        handleBullets();

        // start countdown
        clearInterval(countdowninterval);
        countDown(10, questionsCount);

        // show results
        showResults(questionsCount);
      };
    }
  };

  myRequest.open("GET", "html_quetions.json", true);

  myRequest.send();
}

getQuestions();

function createBullets(num) {
  countSpan.innerHTML = num;

  // create span
  for (let i = 0; i < num; i++) {
    // create bullets
    let theBullet = document.createElement("span");

    if (i === 0) {
      theBullet.className = "on";
    }
    // append bullets to main bullet container
    bulletsSpanContainer.appendChild(theBullet);
  }
}

function addQuestionData(obj, count) {
  if (currentIndex < count) {
    // create h2 question title
    let questionTitle = document.createElement("h2");

    // create question text
    let questionText = document.createTextNode(obj.title);

    // append text to h2
    questionTitle.appendChild(questionText);

    // append h2 to quiz area
    quizArea.appendChild(questionTitle);

    // create the answers
    for (let i = 1; i <= 4; i++) {
      // create main answer div
      let mainDiv = document.createElement("div");

      // add class to main div
      mainDiv.className = "answer";

      // create radio input
      let radioInput = document.createElement("input");

      // add type and name and id and data-attribute to input
      radioInput.type = "radio";
      radioInput.name = "question";
      radioInput.id = `answer_${i}`;
      radioInput.dataset.answer = obj[`answer_${i}`];

      // make the first option checked
      if (i === 1) {
        radioInput.checked = true;
      }
      // create the label
      let theLabel = document.createElement("label");

      // add for attribute
      theLabel.htmlfor = `answer_${i}`;

      // create the text
      let thelabelText = document.createTextNode(obj[`answer_${i}`]);

      // add the label text to label
      theLabel.appendChild(thelabelText);

      // append the input and the label to main div
      mainDiv.appendChild(radioInput);
      mainDiv.appendChild(theLabel);

      // append main div to answers area
      answersArea.appendChild(mainDiv);
    }
  }
}

function checkAnswer(rAnswer, count) {
  let answers = document.getElementsByName("question");

  let theChoosenAnswer;

  for (let i = 0; i < answers.length; i++) {
    if (answers[i].checked) {
      theChoosenAnswer = answers[i].dataset.answer;
    }
  }

  if (theChoosenAnswer === rAnswer) {
    rightAnswers++;
  }
}

function handleBullets() {
  let bulletsSpans = document.querySelectorAll(".bullets .spans span");

  let arrayOfSpans = Array.from(bulletsSpans);

  arrayOfSpans.forEach((span, index) => {
    if (currentIndex === index) {
      span.className = "on";
    }
  });
}

function showResults(count) {
  let theResults;
  if (currentIndex === count) {
    bullets.remove();
    quizArea.remove();
    answersArea.remove();
    submitButton.remove();

    if (rightAnswers > count / 2 && rightAnswers < count) {
      theResults = `<span class="good"> Good </span>, ${rightAnswers} From ${count} `;
    } else if (rightAnswers === count) {
      theResults = `<span class="perfect"> perfect </span>, all answers is good`;
    } else {
      theResults = `<span class="bad"> bad </span>, ${rightAnswers} From ${count} `;
    }

    resultsContainer.innerHTML = theResults;
    resultsContainer.style.padding = "10px";
    resultsContainer.style.backgroundColor = "white";
    resultsContainer.style.marginTop = "10px";
  }
}

function countDown(duration, count) {
  if (currentIndex < count) {
    let minutes, seconds;
    countdowninterval = setInterval(() => {
      minutes = parseInt(duration / 60);
      seconds = parseInt(duration % 60);

      minutes = minutes < 10 ? `0${minutes}` : minutes;
      seconds = seconds < 10 ? `0${seconds}` : seconds;

      countdownElement.innerHTML = `${minutes}:${seconds}`;

      if (--duration < 0) {
        clearInterval(countdowninterval);
        submitButton.click();
      }
    }, 1000);
  }
}
