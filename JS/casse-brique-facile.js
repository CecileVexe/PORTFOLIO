var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");
var x = canvas.width/2;
var y = canvas.height-30;
var dx = 2;
var dy = -2;
var ballRadius = 10;

/*Touches*/
var rightPressed = false;
var leftPressed = false;

/*Barre de contrôle*/
var paddleHeight = 10;
var paddleWidth = 75;
var paddleX = (canvas.width-paddleWidth)/2;

/*Briques*/
var brickRowCount = 5;
var brickColumnCount = 5;
var brickWidth = 75;
var brickHeight = 20;
var brickPadding = 10;
var brickOffsetTop = 30;
var brickOffsetLeft = 30;

var score = 0;

var lives = 3;

/*Tableau de brique*/
var bricks = [];
for(var c=0; c<brickColumnCount; c++) {
    bricks[c] = [];
    for(var r=0; r<brickRowCount; r++) {
      bricks[c][r] = { x: 0, y: 0, status: 1 };
    }
    console.log("Tableau brique",bricks);
}

  function drawBall() {
ctx.beginPath();
ctx.arc(x, y, ballRadius, 0, Math.PI*2);
ctx.fillStyle = "#000000";
ctx.fill();
ctx.closePath();
};

function drawPaddle() {
  ctx.beginPath();
  ctx.rect(paddleX, canvas.height-paddleHeight, paddleWidth, paddleHeight);
  ctx.fillStyle = "#FBE216";
  ctx.fill();
  ctx.closePath();
};

/*Dessiner les briques*/
function drawBricks() {
  for(var c=0; c<brickColumnCount; c++) {
      for(var r=0; r<brickRowCount; r++) {
        if(bricks[c][r].status == 1) {
        /*Parcourir les colonnes et les lignes pour attribuer une position x et y à chaque brique*/
          var brickX = (c*(brickWidth+brickPadding))+brickOffsetLeft;
          var brickY = (r*(brickHeight+brickPadding))+brickOffsetTop;
          bricks[c][r].x = brickX;
          bricks[c][r].y = brickY;
          if (brickX==200 && brickY==90){
            ctx.beginPath();
            ctx.rect(brickX, brickY, brickWidth, brickHeight);
            ctx.fillStyle = "#000000";
            ctx.fill();
            ctx.closePath();
            } else {
          /*Dessin brique*/
          ctx.beginPath();
          ctx.rect(brickX, brickY, brickWidth, brickHeight);
          ctx.fillStyle = "#FBE216";
          ctx.fill();
          ctx.closePath();
            }
      }
  }
}
}


function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBall();
    drawPaddle();
    collisionDetection();
    drawBricks(); 
    drawScore();
    drawLives();
    x += dx;
    y += dy;

    if( y + dy > canvas.height || y + dy < 0 ) {
      dy = -dy;
    } else if(y + dy > canvas.height-ballRadius) {
      if(x > paddleX && x < paddleX + paddleWidth) {
          dy = -dy;
      } else {
          lives --;
          if(!lives) {
          alert("GAME OVER");
          x = -10
          y = 0
          dx = 0
          dy = 0
return
          } else {
            x = canvas.width/2;
            y = canvas.height-30;
            dx = 2;
            dy = -2;
            paddleX = (canvas.width-paddleWidth)/2;
        }
      } 
    }

    if (x + dx > canvas.width || x + dx < 0 ) {
      dx = -dx
    }

    if (y + dy > canvas.width || y + dy < 0 ) {
      dx = -dx
    }

    if(rightPressed) {
      paddleX += 7;
      if (paddleX + paddleWidth > canvas.width){
          paddleX = canvas.width - paddleWidth;
      }
    }
    else if(leftPressed) {
      paddleX -= 7;
      if (paddleX < 0){
          paddleX = 0;
      }
    }
 
    };

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);
document.addEventListener("mousemove", mouseMoveHandler, false);

function mouseMoveHandler(e) {
  var relativeX = e.clientX - canvas.offsetLeft;
  if(relativeX > 0 && relativeX < canvas.width) {
      paddleX = relativeX - paddleWidth/2;
  }
}


function keyDownHandler(e) {
  if(e.key == "Right" || e.key == "ArrowRight") {
      rightPressed = true;
  }
  else if(e.key == "Left" || e.key == "ArrowLeft") {
      leftPressed = true;
  }
};

function keyUpHandler(e) {
  if(e.key == "Right" || e.key == "ArrowRight") {
      rightPressed = false;
  }
  else if(e.key == "Left" || e.key == "ArrowLeft") {
      leftPressed = false;
  }
};

function collisionDetection() {
  for(var c=0; c<brickColumnCount; c++) {
      for(var r=0; r<brickRowCount; r++) {
          var b = bricks[c][r];
          if(b.status == 1) {
              if(x > b.x && x < b.x+brickWidth && y > b.y && y < b.y+brickHeight) {
                if (b.x == 200 && b.y == 90) {
                  clearInterval(interval)
                  interval = setInterval(draw, 10);
                  dy = -dy;
                  b.status = 0;
                  score++;
                }else{
                  dy = -dy;
                  b.status = 0;
                  score++;
                  if(score == brickRowCount*brickColumnCount) {
                      alert("C'est gagné, Bravo !");
                      x = -10
                      y = 0
                      dx = 0
                      dy = 0
                  }
                }
              }
          }
      }
  }
}

function drawScore() {
  ctx.font = "16px Arial";
  ctx.fillStyle = "#000000";
  ctx.fillText("Score: "+score, 8, 20);
}

function drawLives() {
  ctx.font = "16px Arial";
  ctx.fillStyle = "#000000";
  ctx.fillText("Lives: "+lives, canvas.width-65, 20);
}

var interval = setInterval(draw, 20);

document.body.onkeyup = function(e) {
  if (e.key == " " ||
      e.code == "Space" ||      
      e.keyCode == 32      
  ) {
document.location.reload();
clearInterval(interval); // Needed for Chrome to end game
}
}