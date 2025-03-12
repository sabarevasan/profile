document.addEventListener('DOMContentLoaded', () => {

    const grid  = document.querySelector('.grid');
    let squares = Array.from(document.querySelectorAll('.grid div'));
    const width = 10;
    const scoreDisplay = document.querySelector('#score');
    const startBtn = document.querySelector('#start');
    let timerId;
    let nextRandom = 0;
    let score = 0 ;
    const colors =['#D9670BBF', '#D91212BF', '#892EABBF', '#119315BF', '#111A9ABF'];

    //Shapes
    const lShape = [
        [1, width+1, width*2+1, 2],
        [width, width+1, width+2, width*2+2],
        [1, width+1, width*2+1, width*2],
        [width, width*2, width*2+1, width*2+2],
    ];

    const zShape = [
        [0, width, width+1, width*2+1],
        [width+1, width+2, width*2, width*2+1],
        [0, width, width+1, width*2+1],
        [width+1, width+2, width*2, width*2+1],
    ];

    const tShape = [
        [1, width, width+1, width+2],
        [1, width+1, width+2, width*2+1],
        [width, width+1, width+2, width*2+1],
        [1, width, width+1, width*2+1],
    ];

    const oShape = [
        [0, 1, width, width+1],
        [0, 1, width, width+1],
        [0, 1, width, width+1],
        [0, 1, width, width+1],
    ];

    const iShape = [
        [1, width+1, width*2+1, width*3+1],
        [width, width+1, width+2, width+3],
        [1, width+1, width*2+1, width*3+1],
        [width, width+1, width+2, width+3],
    ];

    const theShapes = [lShape, zShape, tShape, oShape, iShape];

    let currentPosition = 4;

    let randomShape = Math.floor(Math.random()*theShapes.length);
    let randomRotation = Math.floor(Math.random()*theShapes[randomShape].length);

    let current = theShapes[randomShape][randomRotation];

    //Draw
    function draw() {
        current.forEach(index => {
            squares[currentPosition + index].classList.add('shape');
            squares[currentPosition + index].style.backgroundColor = colors[randomShape];
            squares[currentPosition + index].style.opacity = '0.75';
        })
    }

    //Undraw
    function undraw() {
        current.forEach(index => {
            squares[currentPosition + index].classList.remove('shape');
            squares[currentPosition + index].style.opacity = '0.25';
            squares[currentPosition + index].style.backgroundColor = '';
        })
    }

    //Assign key functions
    function control(k) {
        if(k.keyCode === 37) {
            moveLeft();
        } else if(k.keyCode === 38) {
            rotate();
        } else if(k.keyCode === 39) {
            moveRight();
        } else if(k.keyCode === 40) {
            moveDown();
        }
    }
    document.addEventListener('keyup', control);

    function isAtRight() {
        return current.some(index=> (currentPosition + index + 1) % width === 0)
    }

    function isAtLeft() {
        return current.some(index=> (currentPosition + index) % width === 0)
    }

    function checkRotatedPosition(P){
        P = P || currentPosition       //get current position.  Then, check if the piece is near the left side.
        if ((P+1) % width < 4) {         //add 1 because the position index can be 1 less than where the piece is (with how they are indexed).
            if (isAtRight()){            //use actual position to check if it's flipped over to right side
                currentPosition += 1    //if so, add one to wrap it back around
                checkRotatedPosition(P) //check again.  Pass position from start, since long block might need to move more.
            }
        }
        else if (P % width > 5) {
            if (isAtLeft()){
                currentPosition -= 1
                checkRotatedPosition(P)
            }
        }
    }

    //Rotate
    function rotate() {
        undraw();
        randomRotation++;
        if(randomRotation === current.length) {
            randomRotation = 0;
        }
        current = theShapes[randomShape][randomRotation];
        checkRotatedPosition();
        draw();
    }

    //Move down
    function moveDown() {
        undraw();
        currentPosition += width;
        draw();
        freeze();
    }

    //Freeze
    function freeze() {
        if(current.some(index => squares[currentPosition + index + width].classList.contains('taken'))) {
            current.forEach(index => squares[currentPosition + index].classList.add('taken'));
            randomShape = nextRandom;
            nextRandom = Math.floor(Math.random()*theShapes.length);
            current = theShapes[randomShape][randomRotation];
            currentPosition = 4;
            draw();
            displayShape();
            addScore();
            gameOver();
        }
    }

    //Move left
    function moveLeft() {
        undraw();
        const isAtLeftEdge = current.some(index => (currentPosition + index)%width === 0);

        if(!isAtLeftEdge) currentPosition -=1;

        if(current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
            currentPosition += 1;
        }
        draw();
    }

    //Move right
    function moveRight() {
        undraw();
        const isAtRightEdge = current.some(index => (currentPosition + index)%width === width-1);

        if(!isAtRightEdge) currentPosition +=1;

        if(current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
            currentPosition -= 1;
        }
        draw();
    }

    //Display up-next in mini-grid
    const displayNext = document.querySelectorAll('.mini-grid div');
    const displayWidth = 4;
    const displayIndex = 0;

    //Shape without rotation
    const upNextShape = [
        [1, displayWidth+1, displayWidth*2+1, 2], //lShape
        [0, displayWidth, displayWidth+1, displayWidth*2+1], //zShape
        [1, displayWidth, displayWidth+1, displayWidth+2], //tShape
        [0, 1, displayWidth, displayWidth+1], //oShape
        [1, displayWidth+1, displayWidth*2+1, displayWidth*3+1] //iShape
    ];

    //Display shape in mini-grid
    function displayShape() {
        displayNext.forEach(square => {
            square.classList.remove('shape');
            square.style.backgroundColor = '';
        });
        upNextShape[nextRandom].forEach(index => {
            displayNext[displayIndex + index].classList.add('shape');
            displayNext[displayIndex + index].style.backgroundColor = colors[nextRandom];
        })
    }

    //Add button function
    startBtn.addEventListener('click', () => {
        if(timerId) {
            clearInterval(timerId);
            timerId = null;
        } else {
            draw();
            timerId = setInterval(moveDown, 1000);
            nextRandom = Math.floor(Math.random()*theShapes.length);
            displayShape();
        }
    })

    //
    function addScore() {
        for(let count= 0; count < 199; count++) {
            const row = [count, count+1, count+2, count+3, count+4, count+5, count+6, count+7, count+8, count+9];
            if(row.every(index => squares[index].classList.contains('shape'))) {
                score += 10;
                scoreDisplay.innerHTML = score;
                row.forEach(index => {
                    squares[index].classList.remove('taken');
                    squares[index].classList.remove('shape');
                    squares[index].style.backgroundColor = '';
                })
                const squaresRemoved = squares.splice(count, width);
                squares = squaresRemoved.concat(squares);
                squares.forEach(cell => grid.appendChild(cell));
            }
        }
    }

    //Game over
    function gameOver() {
        if(current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
            scoreDisplay.innerHTML = 'END';
            clearInterval(timerId);
        }
    }
});