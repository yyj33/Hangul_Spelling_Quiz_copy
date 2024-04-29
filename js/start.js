const main = document.querySelector("#main");
const qna = document.querySelector("#qna");
const result = document.querySelector("#result");
const status = document.querySelector("#statusNum");
const endPoint = 20;
const select = [];

function calResult() {
  var pointArray = [
    { name: 'true', value: 0, key: 0 },
    { name: 'false', value: 0, key: 1 },
  ]

  for (let i = 0; i < endPoint; i++) {
    var target = qnaList[i].a[select[i]];
    for (let j = 0; j < target.type.length; j++) {
      for (let k = 0; k < pointArray.length; k++) {
        if (target.type[j] === pointArray[k].name) {
          pointArray[k].value += 1;
        }
      }
    }
  }

  console.log(pointArray[0].value); //맞힌 개수 체크

  if(pointArray[0].value >= 0 && pointArray[0].value <= 7){
    return 1;
  }
  else if(pointArray[0].value >= 8 && pointArray[0].value <= 12){
    return 2;
  }
  else if(pointArray[0].value >= 13 && pointArray[0].value <= 16){
    return 3;
  }
  else if(pointArray[0].value >= 17 && pointArray[0].value <= 19){
    return 4;
  }
  else{
    return 5;
  }
}

function setResult(){
  let point = calResult();
  var resultImg = document.createElement('img');
  const imgDiv = document.querySelector('#resultImg');
  var imgURL = './img/test' + point + '.png';
  resultImg.src = imgURL;
  resultImg.alt = point;
  resultImg.classList.add('img-fluid');
  imgDiv.appendChild(resultImg);
}

function goResult() {
  qna.style.WebkitAnimation = "fadeOut 1s";
  qna.style.animation = "fadeOut 1s";
  setTimeout(() => {
    result.style.WebkitAnimation = "fadeIn 1s";
    result.style.animation = "fadeIn 1s";
    setTimeout(() => {
      qna.style.display = "none";
      result.style.display = "block";
    }, 450)
  }, 450);
  setResult();
  calResult();
}

function showSummary() {
  const summaryDiv = document.getElementById("wrongAnswers");
  const summaryList = document.getElementById("wrongList");
  summaryList.innerHTML = ""; // Clear previous summary

  for (let i = 0; i < endPoint; i++) {
    const correctAnswer = qnaList[i].a.find(a => a.type.includes("true")).answer;
    const userAnswer = qnaList[i].a[select[i]].answer;
    const isCorrect = correctAnswer === userAnswer;
    const listItem = document.createElement("li");
    
    // Add class for styling based on correctness
    if (isCorrect) {
      listItem.classList.add("correct");
    } else {
      listItem.classList.add("incorrect");
    }
    
    // Construct the summary text
    const summaryText = `${i + 1}. ${qnaList[i].q} - ${isCorrect ? "정답" : "오답"}`;
    listItem.textContent = summaryText;
    summaryList.appendChild(listItem);
  }

  // Show the summary section
  summaryDiv.style.display = "block";
}

function addAnswer(answerText, qIdx, idx) {
  var a = document.querySelector(".answerBox");
  var answer = document.createElement('button');
  answer.classList.add('answerList');
  answer.classList.add('my-3');
  answer.classList.add('py-3');
  answer.classList.add('mx-auto');
  answer.classList.add('fadeIn');
  a.appendChild(answer);
  answer.innerHTML = answerText;

  // 정답을 저장
  const correctAnswer = qnaList[qIdx].a.find(a => a.type.includes("true")).answer;

  answer.addEventListener("click", function() {
    var children = document.querySelectorAll(".answerList");
    for (let i = 0; i < children.length; i++) {
      children[i].disabled = true;
      main.style.WebkitAnimation = "fadeOut 0.5s";
      main.style.animation = "fadeOut 0.5s";
    }

    setTimeout(() => {
      select[qIdx] = idx;
      for (let i = 0; i < children.length; i++) {
        children[i].style.display = "none";
      }
      goNext(++qIdx);
    }, 450);

    // 사용자가 선택한 답변을 저장
    const userAnswer = answer.textContent;
    console.log("사용자의 답변:", userAnswer);
    
    // 답변 비교 및 결과 표시
    if (userAnswer !== correctAnswer) {
      answer.style.color = "red"; // 오답일 경우 텍스트 색상을 빨간색으로 변경
      answer.innerHTML += " (오답)";
    } else {
      answer.style.color = ""; // 정답인 경우 기본 색상으로 변경
      answer.innerHTML += " (정답)";
    }
  }, false);
}




function goNext(qIdx) {
  if (qIdx === endPoint) {
    goResult();
    return;
  }
  
  var q = document.querySelector(".qBox");
  var index = document.querySelector(".statusNum");

  q.innerHTML = qnaList[qIdx].q;
  index.innerHTML = qIdx + 1 + " / 20";

  for (let i in qnaList[qIdx].a) {
    addAnswer(qnaList[qIdx].a[i].answer, qIdx, i);
  }

  var status = document.querySelector('.statusBar');
  status.style.width = (100 / endPoint) * (qIdx + 1) + "%";
}

function begin() {
  main.style.WebkitAnimation = "fadeOut 1s";
  main.style.animation = "fadeOut 1s";
  setTimeout(() => {
    qna.style.WebkitAnimation = "fadeIn 1s";
    qna.style.animation = "fadeIn 1s";
    setTimeout(() => {
      main.style.display = "none";
      qna.style.display = "block";
    }, 450)
    let qIdx = 0;
    goNext(qIdx);
  }, 450);
}

function again() {
  location.href = "https://hanguel-spelling-test.github.io/"; 
}

function copyToClipboard(val) {
  const t = document.createElement("textarea");
  document.body.appendChild(t);
  t.value = val;
  t.select();
  document.execCommand('copy');
  document.body.removeChild(t);
}

function copy() {
  copyToClipboard('https://hanguel-spelling-test.github.io/');
  alert('링크가 복사되었습니다!');
}

function openCloseToc() {
  if (document.getElementById('toc-content').style.display === 'block') { 
      document.getElementById('answer').textContent = '정답 보기';
      document.getElementById('toc-content').style.display = 'none';
  } else {
      document.getElementById('answer').textContent = '닫기';
      document.getElementById('toc-content').style.display = 'block';
  }
}


// "정답 보기" 버튼에 이벤트 리스너를 추가하여 요약을 표시합니다.
document.getElementById("answer").addEventListener("click", function() {
  showSummary();
}, false);
