const data = {
  activityData: [],
};
const elemsHeight = [];

const elemHeader = document.querySelector('#Header');
const elemWrapper = document.querySelector('#Wrapper');
const elemHdBtn = document.querySelector('#HdBtn');
const elemNavi = document.querySelector('#Navi');
const elemBannerScreen = document.querySelector('#BannerScreen');
const elemIntroBtn = document.querySelector('#IntroBtn');
const elemFileTimeDesc = document.querySelector('#FileTimeDesc');
const elemFileTimeText = document.querySelector('#FileTimeText');
const elemProgress = document.querySelector('#Progress');
const elemFileApply = document.querySelector('#FileApply');
const elemAnimateItems = document.querySelectorAll('#Product .js-anima,#Result .js-anima');

const dataUrl = './data/activity.json';
const limitedPersonNum = 100;
let remainTimeTotal = 0;

const bannerDataLen = 4;
let bannerIndex = 1;
let animateIndex = 0;
let deadline = '';

const barTemp = (item) => `
        <div class="progress__text ${item.level <= data.activityData.personNum ? ' js-progress__text' : ''}" style="left: ${item.level}%;">
          <p class="progress__desc progress__desc--up">
          達 ${item.level} 人
          </p>
          <p class="progress__desc progress__desc--down">
          送 ${item.productName}
          </p>
        </div>`;

(async () => {
  data.activityData = await fetchData();
  deadline = data.activityData.endTime;
  remainTimeTotal = getTimeRemaining(deadline).total;
  const elemProgressBar = document.querySelector('#ProgressBar');
  elemProgressBar.innerHTML += strMaker(barTemp, data.activityData.list);
  elemProgressBar.style.width = `${data.activityData.personNum > limitedPersonNum ? 100 : data.activityData.personNum / limitedPersonNum * 100}%`;
  setInterval(timerBannerEvent, 5000);
  setFileStatus();
  setListener();
  getItemHeight();
})();

function setListener() {
  window.addEventListener('scroll', scrollEvent);
  elemHdBtn.addEventListener('click', clickToShowNav);
  elemIntroBtn.addEventListener('click', clickToShowVideo);
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
    elemFileApply.innerHTML = '<p class="file__applyEnd">已爆滿!</p>';
  } else {
    elemFileTimeDesc.innerHTML = '優惠活動結束';
    elemFileTimeText.innerHTML = '請再關注我們的優惠時間';
    elemFileApply.innerHTML = `
    <p class="file__applyStatus">已有 <span class="file__applyNum">${data.activityData.personNum}</span>人報名</p>
    <button class="file__applyBtn">搶先報名&raquo;</button>`
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
      elemFileTimeText.innerHTML = '請再關注我們的優惠時間';
      clearInterval(timeInterval);
    };
  }, 1000);
};

function createNode() {
  const newNode = document.createElement('div');
  newNode.setAttribute('class', 'cover');
  newNode.setAttribute('id', 'Cover');
  newNode.innerHTML = `
      <iframe 
        class="video__youtube" 
        width="${window.innerWidth > 600 ? 600 : innerWidth}" 
        height="${400}" src="https://www.youtube.com/embed/syFyL9tONRA"
        title="YouTube video player" 
        frameborder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowfullscreen>
      </iframe>`;
  return newNode;
};

function clickToShowVideo() {
  elemWrapper.appendChild(createNode());
  const elemCover = document.querySelector('#Cover');
  document.body.style.overflow = 'hidden';
  window.addEventListener('keyup', keyUptoCloseVideo);
  elemCover.addEventListener('click', clickToCloseVideo);
};

function keyUptoCloseVideo(e) {
  if (e.keyCode === 27 && elemWrapper.lastChild.id === 'Cover') {
    elemWrapper.lastChild.remove();
    document.body.style.overflow = 'auto';
  };
};

function clickToCloseVideo(e) {
  const self = e.target;
  if (self.id === 'Cover') {
    self.remove();
    document.body.style.overflow = 'auto';
  };
};

function strMaker(temp, data, str = '') {
  data.map((item, i) => {
    str += temp(item, i);
  });
  return str;
};

function getItemHeight() {
  elemAnimateItems.forEach(item => {
    const offset = item.offsetTop;
    elemsHeight.push(offset);
  });
  return elemsHeight;
};

function classAdder(item) {
  if (item.nodeName === 'H2' || item.nodeName === 'H4') {
    item.classList.add('js-anima--down');
  } else if (item.nodeName === 'H4' || item.nodeName === 'DIV') {
    item.classList.add('js-anima--up');
  };
};

function clickToShowNav() {
  elemNavi.style.display = 'flex';
  document.addEventListener('click', clickToHideNav, true);
};

function clickToHideNav() {
  elemNavi.style.display = 'none';
  document.removeEventListener('click', clickToHideNav);
};

function numberRunner(item, count, num = 0, timer = '') {
  timer = setInterval(() => {
    if (num < count) {
      item.innerText = ++num;
    } else {
      clearInterval(timer);
    }
  }, 1000 / count);
};

function runnerInit(elem) {
  const animateTarget = elem.children[0].children[0];
  const targetNum = parseInt(animateTarget.dataset.count, 10);
  numberRunner(animateTarget, targetNum);
};

function scrollEvent() {
  const scrollTop = document.documentElement.scrollTop;
  const windowHeight = document.documentElement.clientHeight;
  const windowHalfHeight = scrollTop + windowHeight / 2;
  const item = elemAnimateItems[animateIndex];
  if (windowHalfHeight > elemsHeight[animateIndex]) {
    classAdder(item);
    if (item.parentNode.id === 'ResultBar') {
      runnerInit(item);
    };
    animateIndex++;
  };
  if (scrollTop !== 0) {
    elemHeader.classList.add('js-hd');
  } else {
    elemHeader.classList.remove('js-hd');
  };
};
