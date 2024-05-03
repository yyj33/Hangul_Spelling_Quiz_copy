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

  return { answerText, correctAnswer };
  
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

function showUserAnswers() {
  const tocContent = document.getElementById('toc-content');
  tocContent.innerHTML = "";

  // 각 질문의 정답을 보여주기 위해 반복문 사용
  for (let i = 0; i < select.length; i++) {
    const question = qnaList[i].q; // 질문 내용 가져오기
    const userSelectedAnswer = qnaList[i].a[select[i]].answer; // 사용자가 선택한 답변 가져오기
    const correctAnswer = qnaList[i].a.find(a => a.type.includes("true")).answer; // 정답 가져오기

    // 각 질문과 그에 해당하는 사용자의 선택과 정답을 보여주기
    const questionDiv = document.createElement('div');
    questionDiv.innerHTML = `<p><strong>${question}</strong></p>`;
    questionDiv.innerHTML += `<p>선택: ${userSelectedAnswer}</p>`;
    questionDiv.innerHTML += `<p>정답: ${correctAnswer}</p>`;
    tocContent.appendChild(questionDiv);
  }
}

function openCloseToc() {
  const tocContent = document.getElementById('toc-content');
  const answerBtn = document.getElementById('answer');

  if (tocContent.style.display === 'block') {
      tocContent.style.display = 'none';
      answerBtn.textContent = '정답 보기';
  } else {
      tocContent.style.display = 'block';
      answerBtn.textContent = '닫기';
      showUserAnswers(); // 사용자가 선택한 답변과 정답을 보여주는 함수 호출
    }
}

