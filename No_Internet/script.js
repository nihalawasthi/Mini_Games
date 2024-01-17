const gameContainer = document.getElementById('game-container');
const player = document.getElementById('player');
let isJumping = false;
let obstacles = [];
let gameSpeed = 5;
let obstacleSpawnTimer = 0;

function createObstacle() {
  const obstacle = document.createElement('div');
  obstacle.classList.add('cactus');
  obstacle.style.right = '0px';
  gameContainer.appendChild(obstacle);
  obstacles.push(obstacle);
}

function moveObstacles() {
  obstacleSpawnTimer++;

  if (obstacleSpawnTimer % 100 === 0) {
    createObstacle();
  }

  for (let i = 0; i < obstacles.length; i++) {
    let obstacle = obstacles[i];
    obstacle.style.right = parseInt(obstacle.style.right) + gameSpeed + 'px';

    if (collisionDetection(player, obstacle)) {
      gameOver();
    }

    if (parseInt(obstacle.style.right) > window.innerWidth) {
      obstacle.remove();
      obstacles.splice(i, 1);
      i--;
    }
  }

  requestAnimationFrame(moveObstacles);
}

function collisionDetection(player, obstacle) {
  let playerRect = player.getBoundingClientRect();
  let obstacleRect = obstacle.getBoundingClientRect();

  return !(
    playerRect.top > obstacleRect.bottom ||
    playerRect.right < obstacleRect.left ||
    playerRect.bottom < obstacleRect.top ||
    playerRect.left > obstacleRect.right
  );
}

function jumpPlayer() {
  if (!isJumping) {
    isJumping = true;
    let count = 0;
    let jumpInterval = setInterval(() => {
      let position = parseInt(window.getComputedStyle(player).getPropertyValue('bottom'));
      if (position >= 150) {
        clearInterval(jumpInterval);
        let fallInterval = setInterval(() => {
          if (position <= 0) {
            clearInterval(fallInterval);
            isJumping = false;
          } else {
            position -= 10;
            player.style.bottom = position + 'px';
          }
        }, 25);
      } else {
        count += 30;
        position += count * 0.1;
        player.style.bottom = position + 'px';
      }
    }, 25);
  }
}

function gameOver() {
  alert('Game Over!');
  obstacles.forEach(obstacle => obstacle.remove());
  obstacles = [];
  player.style.bottom = '0px';
  isJumping = false;
  setTimeout(() => {
    window.location.reload(); // Reload the page after game over
  }, 1000);
}

document.addEventListener('keydown', (event) => {
  if (event.code === 'Space') {
    jumpPlayer();
  }
});

moveObstacles();