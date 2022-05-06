const data = {
  activityData: [],
};

const elemHeader = document.querySelector('#Header');
const elemBannerImg = document.querySelector('#BannerImg');
const elemBannerScreen = document.querySelector('#BannerScreen');

const elemFileTimeDesc = document.querySelector('#FileTimeDesc');
const elemFileTimeText = document.querySelector('#FileTimeText');
const elemProgress = document.querySelector('#Progress');
const elemProgressBar = document.querySelector('#ProgressBar');
const elemFileApply = document.querySelector('#FileApply');


const dataUrl = './data/activity.json';
const limitedPersonNum = 100;
let remainTimeTotal = 0;



const bannerDataLen = 4;
let bannerIndex = 0;
let progressIndex = 0;
let deadline = '';

const barTemp = (item, i) => `
        <div class="progress__text ${item.level <= data.activityData.personNum ? ' js-progress__text' : ''}  progress__text--order${i + 1}">
          <p class="progress__desc progress__desc--up">
            達 ${item.level} 人
          </p>
          <p class="progress__desc progress__desc--down">
            送 ${item.productName}
          </p>
        </div>`;

(async () => {
  data.activityData = await fetchData();
  // deadline = data.activityData.endTime;
  deadline = '2022/05/06 16:55:00';
  progressIndex = Math.floor(limitedPersonNum / parseInt(data.activityData.personNum, 10)) - 1;
  remainTimeTotal = getTimeRemaining(deadline).total;
  elemProgress.innerHTML += strMaker(barTemp, data.activityData.list);
  elemProgressBar.style.width = `${data.activityData.personNum / limitedPersonNum * 100}%`;
  setInterval(timerBannerEvent, 5000);
  setFileStatus()
  setListener();
})();

function setListener() {
  window.addEventListener('scroll', scrollEvent);
};

async function fetchData() {
  try {
    const res = await fetch(dataUrl);
    return result = res.json();
  } catch (e) {
    console.log(e.message);
  };
};

function timerBannerEvent() {
  elemBannerScreen.children[bannerIndex].classList.remove('js-banner__img');
  bannerIndex = (bannerIndex + 1) % bannerDataLen;
  elemBannerScreen.children[bannerIndex].classList.add('js-banner__img');
};

function getTimeRemaining(time) {
  const total = Date.parse(time) - Date.parse(new Date());
  const seconds = Math.floor((total / 1000) % 60);
  const minutes = Math.floor((total / 1000 / 60) % 60);
  const hours = Math.floor((total / (1000 * 60 * 60)) % 24);
  const days = Math.floor(total / (1000 * 60 * 60 * 24));
  return { total, days, hours, minutes, seconds };
};

function setFileStatus() {
  if (remainTimeTotal > 0 && data.activityData.personNum < limitedPersonNum) {
    setClock(deadline);
    elemFileApply.innerHTML = `
      <p class="file__applyStatus">已有 <span class="file__applyNum">${data.activityData.personNum}</span>人報名</p>
      <button class="file__applyBtn">搶先報名&raquo;</button>`
  } else if (remainTimeTotal > 0 && data.activityData.personNum >= limitedPersonNum) {
    elemFileTimeDesc.innerHTML = '贈送完畢';
    elemFileTimeText.innerHTML = '我們提早結束優惠';
    elemFileApply.innerHTML = `<p class="file__applyEnd">已爆滿!</p>`;
  } else {
    elemFileTimeDesc.innerHTML = '優惠活動結束';
    elemFileTimeText.innerHTML = '請再關注我們的優惠時間';
    elemFileApply.innerHTML = `<p class="file__applyEnd">已額滿!</p>`;
  };
};

function setClock() {
  elemFileTimeDesc.innerHTML = '優惠倒數';
  const timeInterval = setInterval(() => {
    const remainTime = getTimeRemaining(deadline);
    elemFileTimeText.innerHTML = `
    <span class="file__timeNum">${remainTime.days < 10 ? '0' + remainTime.days : remainTime.days}</span> 天
    <span class="file__timeNum">${remainTime.hours < 10 ? '0' + remainTime.hours : remainTime.hours}</span> 時 
    <span class="file__timeNum">${remainTime.minutes < 10 ? '0' + remainTime.minutes : remainTime.minutes}</span> 分 
    <span class="file__timeNum">${remainTime.seconds < 10 ? '0' + remainTime.seconds : remainTime.seconds}</span> 秒 `;
    if (remainTime.total <= 0) {
      elemFileTimeDesc.innerHTML = '優惠活動結束';
      elemFileTimeText.innerHTML = `請再關注我們的優惠時間`;
      clearInterval(timeInterval);
    };
  }, 1000);
};




function strMaker(temp, data, str = '') {
  data.map((item, i) => {
    str += temp(item, i);
  });
  return str;
};

function scrollEvent() {
  const scrollTop = document.documentElement.scrollTop;
  if (scrollTop !== 0) {
    elemHeader.classList.add('js-hd');
  } else {
    elemHeader.classList.remove('js-hd');
  };
};