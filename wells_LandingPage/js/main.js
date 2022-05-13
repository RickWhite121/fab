const eleBar = document.getElementById('Bar');
const eleBarIcon = document.getElementById('BarIcon');
const eleBarWrapper = document.getElementById('BarWrapper');
const elePromotionsDay = document.getElementById('PromotionsDay');
const elePromotionsHour = document.getElementById('PromotionsHour');
const elePromotionsMinute = document.getElementById('PromotionsMinute');
const elePromotionsSecond = document.getElementById('PromotionsSecond');
const eleProgressWrapper = document.getElementById('ProgressWrapper');
const eleProgressBar = document.getElementById('ProgressBar');
const elePromotionsPersonNum = document.getElementById('PromotionsPersonNum');
const elePromotionsCount = document.getElementById('PromotionsCount');
const elePromotionsDeadline = document.getElementById('PromotionsDeadline');
const elePromotionsParticipant = document.getElementById('PromotionsParticipant');
const eleIntroductionVideo = document.getElementById('IntroductionVideo');
const eleCourseSlogan = document.getElementById('CourseSlogan');
const eleCourseWrapper = document.getElementById('CourseWrapper');
const eleAchievementTitle = document.getElementById('AchievementTitle');
const eleAchievementWrapper = document.getElementById('AchievementWrapper');
const eleTable = document.getElementById('Table');
const eleVideoWrapper = document.getElementById('VideoWrapper');
const isFirstFadeInArr = [false, false, false];
const eleArr = [];
let fadeInCount = 0;
let isFirstClickVideo = true;

// 初始化
(async () => {
  // 獲取資料
  const { endTime, personNum, list } = await getData();

  // 將動畫元素放入容器
  updateEleArr();

  //設置優惠倒數、各類事件 
  setPromotionsDate(endTime, personNum, list);
  setEvent();
})();

// 獲取資料
async function getData() {
  const res = await fetch('../data/activity.json', { method: 'GET' });
  return res.json();
}

// 優惠活動設定
function setPromotionsDate(date, personNum, list, promotionsTimer = 0) {
  const deadline = new Date(date).getTime();
  let countdown = deadline - new Date().getTime();
  if (countdown >= 0) {
    if (personNum < 100) {
      promotionsTimer = setInterval(() => {
        countdown = deadline - new Date().getTime();
        if (countdown >= 0) {
          renderPromotionsDate(countdown);
        } else {
          renderPromotionsProgressBar(
            { ele: elePromotionsCount, value: '優惠結束' },
            { ele: elePromotionsDeadline, value: '請再關注我們的優惠時間' });
          clearInterval(promotionsTimer);
        }
      }, 1000);
      renderPromotionsProgressBar(
        { ele: eleProgressBar, value: personNum },
        { ele: eleProgressWrapper, value: makeDataStr(list, personNum) },
        { ele: elePromotionsPersonNum, value: personNum });
    } else {
      renderPromotionsProgressBar(
        { ele: elePromotionsCount, value: '贈送完畢' },
        { ele: elePromotionsDeadline, value: '我們提早結束優惠' },
        { ele: eleProgressBar, value: personNum },
        { ele: eleProgressWrapper, value: makeDataStr(list, personNum) },
        { ele: elePromotionsParticipant, value: '已爆滿!' });
    }
  } else {
    renderPromotionsProgressBar(
      { ele: elePromotionsCount, value: '優惠活動結束' },
      { ele: elePromotionsDeadline, value: '請再關注我們的優惠時間' },
      { ele: eleProgressBar, value: personNum },
      { ele: eleProgressWrapper, value: makeDataStr(list, personNum) },
      personNum < 100 ? { ele: elePromotionsPersonNum, value: personNum } : { ele: elePromotionsParticipant, value: '已額滿!' });
  }
}

// 渲染優惠活動
function renderPromotionsProgressBar(...obj) {
  obj.forEach(e => {
    if (e.ele === eleProgressBar) {
      e.ele.value = e.value;
    } else if (e.ele === eleProgressWrapper) {
      e.ele.innerHTML += e.value;
    } else {
      e.ele.innerHTML = e.value
    }
  });
}

// 計算優惠倒數時間
function renderPromotionsDate(countdown) {
  let totalSecond = Math.ceil(countdown / 1000);
  let second = totalSecond % 60;
  let totalMinute = (totalSecond - second) / 60;
  let minute = totalMinute % 60;
  let totalHour = (totalMinute - minute) / 60;
  let hour = totalHour % 24;
  let day = (totalHour - hour) / 24;
  renderPromotionsProgressBar(
    { ele: elePromotionsDay, value: day },
    { ele: elePromotionsHour, value: hour },
    { ele: elePromotionsMinute, value: minute },
    { ele: elePromotionsSecond, value: second });
}

// 拼接ProgressBar的資訊
function makeDataStr(list, personNum, str = '') {
  list.forEach(e => {
    str += `
      <div class="progress__outer" style="left: ${e.level}%;${e.level > personNum ? ' background-color: #ddd;' : ''}">
        <div class="progress__text progress__text-num">達 ${e.level} 人</div>
        <div class="progress__text progress__text-product">送 ${e.productName}</div>
      </div>`;
  });

  return str;
}

// 綁定事件
function setEvent() {
  window.addEventListener('scroll', scrollEvent);
  eleBarIcon.addEventListener('click', showBtnWrapperEvent, true)
  eleIntroductionVideo.addEventListener('click', videoClickEvent);
  eleVideoWrapper.addEventListener('click', videoRemoveEvent);
}

// 滾輪事件
function scrollEvent() {
  if (window.scrollY) {
    eleBar.classList.contains('bar--scroll') ? '' : eleBar.classList.add('bar--scroll');
  } else {
    eleBar.classList.remove('bar--scroll');
  }

  if (fadeInCount === eleArr.length || !(eleArr[fadeInCount].offsetTop - window.scrollY <= window.innerHeight / 2)) return;
  fadeIn(eleArr);
}

// 淡入效果設置
function fadeIn(eleArr) {
  if (eleArr[fadeInCount].parentNode.id === 'AchievementWrapper') {
    const eleArrText = eleArr[fadeInCount].children[0].children[0]
    achievementChartInterval(eleArrText, parseInt(eleArrText.dataset.num, 10));
  }
  eleArr[fadeInCount].classList.add('fade-in--active');
  fadeInCount++;
}

// 將動畫元素依序放進容器
function updateEleArr() {
  eleArr.push(eleCourseSlogan);
  [...eleCourseWrapper.children].forEach(article => {
    [...article.children].forEach(ele => eleArr.push(ele));
  });
  eleArr.push(eleAchievementTitle);
  [...eleAchievementWrapper.children].forEach(ele => eleArr.push(ele));
  eleArr.push(eleTable);
}

// 培訓成果的計數器
function achievementChartInterval(ele, num, count = 0, timer = '') {
  timer = setInterval(() => count < num ? ele.innerText = ++count : clearInterval(timer), 10);
}

// 影片點擊事件
function videoClickEvent() {
  eleVideoWrapper.style.height = window.innerHeight + 'px';
  eleVideoWrapper.style.top = window.pageYOffset + 'px';
  eleVideoWrapper.classList.add('video__wrapper--show');
  document.body.style.overflow = 'hidden';
  if (isFirstClickVideo) {
    eleVideoWrapper.innerHTML = `
      <iframe class="video__youtube" width="600" height="400" src="https://www.youtube.com/embed/syFyL9tONRA"
      title="YouTube video player" frameborder="0"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowfullscreen></iframe>`;
    isFirstClickVideo = !isFirstClickVideo;
  }
  window.addEventListener('keyup', keyEvent);
}

// 影片移除事件
function videoRemoveEvent() {
  eleVideoWrapper.classList.remove('video__wrapper--show');
  document.body.style.overflow = 'auto';
}

// 影片的鍵盤事件
function keyEvent(e) {
  if (e.key !== 'Escape') return;
  videoRemoveEvent();
  window.removeEventListener('keyup', keyEvent);
}

// 手機板選單點擊事件
function showBtnWrapperEvent() {
  eleBarWrapper.style.display = 'flex';
  document.addEventListener('click', hideBtnWrapperEvent, true);
}

// 手機板選單隱藏事件
function hideBtnWrapperEvent(e) {
  if (e.target.parentNode.id === 'BarWrapper') return;
  eleBarWrapper.style.display = 'none';
  document.removeEventListener('click', hideBtnWrapperEvent);
}
