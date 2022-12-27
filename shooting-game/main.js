// canvas setting
let canvas;
let ctx;
canvas = document.createElement("canvas");
ctx = canvas.getContext("2d");
canvas.width = 500;
canvas.height = 700;
document.body.appendChild(canvas);

let backgroundImage, spaceshipImage, bulletImage, enemy1Image, gameoverImage;
function loadImage() {
  backgroundImage = new Image();
  backgroundImage.src = "images/background.gif";

  spaceshipImage = new Image();
  spaceshipImage.src = "images/spaceship.png";

  bulletImage = new Image();
  bulletImage.src = "images/bullet.png";

  enemy1Image = new Image();
  enemy1Image.src = "images/enemy1.png";

  gameoverImage = new Image();
  gameoverImage.src = "images/gameover.png";
}

// 우주선 좌표
let spaceshipX = canvas.width / 2 - 32;
let spaceshipY = canvas.height - 64;

// 키보드 입력
let keysDown = {};
function setupKeyboard() {
  document.addEventListener("keydown", function (event) {
    keysDown[event.keyCode] = true;
  });
  document.addEventListener("keyup", function (event) {
    delete keysDown[event.keyCode];

    if (event.keyCode == 32) {
      createBullet(); //총알 생성
    }
  });
}

function update() {
  if (39 in keysDown) {
    spaceshipX += 5;
  } // 우측 화살표 입력시 우주선 이동
  if (37 in keysDown) {
    spaceshipX -= 5;
  } // 좌측 화살표
  if (spaceshipX <= 0) {
    spaceshipX = 0;
  }
  if (spaceshipX >= canvas.width - 64) {
    spaceshipX = canvas.width - 64;
  } //프레임 고정

  for (let i = 0; i < bulletList.length; i++) {
    if (bulletList[i].alive) {
      bulletList[i].update();
      bulletList[i].checkHit();
    } // 총알 발사
  }
  for (let i = 0; i < enemy1List.length; i++) {
    enemy1List[i].update();
  } // 적군 생성
}

//총알 발사
let bulletList = [];
let score = 0;
function bullet() {
  this.x = 0;
  this.y = 0;
  this.init = function () {
    this.x = spaceshipX + 32;
    this.y = spaceshipY;
    this.alive = true; // true 총알 존재
    bulletList.push(this);
  };
  this.update = function () {
    this.y -= 7;
  };
  this.checkHit = function () {
    for (let i = 0; i < enemy1List.length; i++) {
      if (
        //총알 적군 명중
        this.y <= enemy1List[i].y &&
        this.x >= enemy1List[i].x &&
        this.x <= enemy1List[i].x + 45
      ) {
        score++;
        this.alive = false; // 총알 제거
        enemy1List.splice(i, 1);
      }
    }
  };
}

function createBullet() {
  console.log("총알 생성");
  let b = new bullet();
  b.init();
  console.log("총알 리스트", bulletList);
}

//적군 생성
let enemy1List = [];
let gameover = false; // true : gameover
function enemy1() {
  this.x = 0;
  this.y = 0;
  this.init = function () {
    this.x = generateRandomValue(0, canvas.width - 64);
    this.y = 0;
    enemy1List.push(this);
  };
  this.update = function () {
    this.y += 3; // 적군 속도 조절

    if (this.y >= canvas.height - 64) {
      gameover = true;
      console.log("gameover");
    }
  };
}

function generateRandomValue(min, max) {
  let randomNum = Math.floor(Math.random() * (max - min + 1)) + min;
  return randomNum;
}

function createenemy1() {
  const interval = setInterval(function () {
    let e = new enemy1();
    e.init();
  }, 500);
}

//랜더링
function render() {
  ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
  ctx.drawImage(spaceshipImage, spaceshipX, spaceshipY);
  ctx.fillText('Score :'+score,20,35);
  ctx.fillStyle = "white";
  ctx.font = "20px Arial";
  for (let i = 0; i < bulletList.length; i++) {
    if (bulletList[i].alive) {
      ctx.drawImage(bulletImage, bulletList[i].x, bulletList[i].y);
    }
  }
  for (let i = 0; i < enemy1List.length; i++) {
    ctx.drawImage(enemy1Image, enemy1List[i].x, enemy1List[i].y);
  }
}
//메인함수
function main() {
  if (!gameover) {
    update();
    render();
    requestAnimationFrame(main);
  } else {
    ctx.drawImage(gameoverImage, 100, 100, 300, 300);
  }
}

loadImage();
setupKeyboard();
createenemy1();
main();
