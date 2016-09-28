---
layout: post
title: "Buggy SnAkE for the Js13kGames (???)"
date:   2016-09-29 18:05:00
image: <img src='/assets/sliding_puzzle/sliding_puzzle.png' alt='Buggy SnAkE for the Js13kGames'>
---
<div class='image right'>
<img src='/assets/sliding_puzzle/sliding_puzzle.png' alt='Buggy SnAkE for the Js13kGames'>
<span class="caption">Buggy SnAkE for the Js13kGames</span>
</div>
After 4 years of slacking off I finally had time, energy and idea to do [another][swift] game for the [Js13kGames][Js13kGames] contest. With help from [Bartek][bartaz] we created a glitched version of the classic Snake game.
In this article I want to show you(??) the most interesting programming challenges and ideas we came of during development of the [buggy SnAkE game][buggySnake].

<!--more-->

This year's theme of the [Js13kGames][Js13kGames] competition is `Glitch`. We had an idea to create a well known classic game and add some glitches to it. We choose Snake because it is one of the easiest game to do in canvas. And also because I loved the Snake 2 game originally released on Nokia 3310 phone. I used to spend lot's of time mastering it when I was younger, mostly while commuting to school.
It was also important to do something that people know and recognise. I am aware (also from my own experience) that sometimes people are too lazy to read rules of a new game. It is not very practical to do complicated entry for contests like [Js13kGames][Js13kGames], where people want to play and test as many different games as possible.

I think that there is no need to explain the rules of classic Snake in much details. Simply as that: player has to control the snake and collect food in order to get more points. Our SnAkE version has three additional features though: **glitched graphic**, the **TRON mode** and the **ability to go through walls**.
We wanted the game to have a retro graphic style, the more similar to the classic Nokia Snake the best. We ended up showing (???) the snake just as a line as it was in the old Nokia's 3210 'Snake 1' game. The graphical inspiration for bugs was obviously my favourite Nokia's 3310 'Snake 2' version. Because of the limited *4 x 8* cells' sizes we were forced to alter a little those original bugs. Hopefully they still remind you the original ones!

### How to program the standard Snake game?

This post's idea is to focus mainly on the most interesting and little bit more advanced technical details of the SnAkE game. But in order to understand them, it's important to be aware of how the classic Snake version works:

~~~js
Snake.SNAKE = [];

Snake.Game.initSnake = function() {
	for(var i = 0; i < 5; i++) { //let's start with snake length 5
		//horizontal snake starting from the top left
		Snake.SNAKE.push({x: i, y: 0});
	}
};

Snake.Game.paint = function() {
    //paint the board
	Snake.CTX.fillStyle = 'white';
	Snake.CTX.fillRect(0, 0, Snake.CANVASW, Snake.CANVASH);
	Snake.CTX.strokeStyle = 'black';
	Snake.CTX.strokeRect(0, 0, Snake.CANVASW, Snake.CANVASH);

	//take the snake's head
	var snakeX = Snake.SNAKE[Snake.SNAKE.length - 1].x;
	var snakeY = Snake.SNAKE[Snake.SNAKE.length - 1].y;

	if (Snake.DIRECTION == 'right') snakeX++;
	else if (Snake.DIRECTION == 'left') snakeX--;
	else if (Snake.DIRECTION == 'up') snakeY--;
	else if (Snake.DIRECTION == 'down') snakeY++;

	this.checkCollision(snakeX, snakeY);

	//if the new head position matches the food,
	//create a new head instead of moving the tail
	if (snakeX == Snake.FOOD.x && snakeY == Snake.FOOD.y) {
		var tail = {
			x: snakeX,
			y: snakeY
		};
		this.ui.updateScore();
		this.initFood();
	} else {
		var tail = Snake.SNAKE.shift(); //take the first cell - tail
		tail.x = snakeX;
		tail.y = snakeY;
	}

	Snake.SNAKE.push(tail); //puts back the tail as the new head

    //paint the snake
	for (var i = 0; i < Snake.SNAKE.length; i++) {
		var cell = Snake.SNAKE[i];
		this.paintCell(cell.x, cell.y);
	}

	//paint the food
	this.paintCell(Snake.FOOD.x, Snake.FOOD.y);

	this.ui.paintScore();
};
~~~

This is how we started implementing the first version of the game. Originally snake was implemented? as an `Array` of objects with `x` and `y` coordinates. In the main game loop we have to repaint the whole board (which is just a rectangular in `canvas`), take the snake's head coordinates and update them based on the player's key pressed.
We have to check a few things before re-drawing the snake. First, if it didn't collide with the walls or itself. Secondly, if the snake's head didn't match the position of randomly generated food. If so, update score points, generate new food and save the food's position as the new piece of the snake. If there is no food there, just take the current tail and place it in front of the snake, so it will be it's new head.

This is how to implement the basic Snake game. But in order to introduce glitched features we had to refactor almost everything what you just learnt (what I just shown? what shown above?). Without further due let's focus on much more interesting parts of the game.

### Introducing graphical glitches (??)

In order to easily implement glitched and retro like graphic, we had to divide the whole canvas into *20 x 20 px* cells. The whole board (including score points, HI score and bug's timeout at the top) is represented as a `two dimensional Array` (2d array??):

~~~js
Snake.Game.initStateValues = function() {
    this.state = {
		board: [],
		boardWidth: 30,
		boardHeight: 30,
		borderOffset: {
			top: 4,
			bottom: 2,
			left: 2,
			right: 2
		}
	}
};

Snake.Board.initBoard = function(state) {
	var offset = state.borderOffset;

    //create a two dimensional Array (array??) with no walls at all
	for (var x = 0; x < state.boardWidth; x++) {
		state.board[x] = new Array(state.boardWidth);
		for (var y = 0; y < state.boardHeight; y++) {
			state.board[x][y] = {
				type: null,
				isGlitched: false
			};
		}
	}

    //mark two horizontal lines as walls
	for (x = offset.left; x < state.boardWidth - offset.right; x++) {
		state.board[x][offset.top].type = 'wall';
		state.board[x][state.boardHeight - offset.bottom - 1].type = 'wall';
	}

    //mark two vertical lined as walls
	for (y = offset.top; y < state.boardHeight - offset.bottom; y++) {
		state.board[offset.left][y].type = 'wall';
		state.board[state.boardWidth - offset.right - 1][y].type = 'wall';
	}
};
~~~

During the initialisation, the whole board is saved into `board` 2d array, where each cell is represented as an object with `type` and `isGlitched` properties. After creating the empty `board` array, we have to mark proper horizontal and vertical lines as walls, by setting it's cells `type` to `wall`.

Now the painting algorithm is quite straightforward. We just have to go through the main `board` array and paint the elements (wall pieces, food and bugs) in a proper place, with given graphic style and defined color:

~~~js
Snake.UI.paint = function(state) {
//paint the board
	for (var x = 0; x < state.boardWidth; x++) {
		for (var y = 0; y < state.boardHeight; y++) {
			cell = state.board[x][y];
			if (cell.type === 'wall') {
				var cellPixels = this.cells.wall[this.getWallCellType(x, y, state.board)];
				this.paintCell(x, y, this.color[state.mode].wall, cellPixels, cell.isGlitched);
			} else if (cell.type === 'food') {
				this.paintCell(x, y, this.color[state.mode].food, this.cells.food);
			} else if (cell.type === 'buggybug') {
				this.paintCell(x, y, this.color[state.mode].bug, this.cells[cell.body]);
			}
		}
	}
};

this.paintPixels();
~~~

Each *20 x 20 px* cell is drawn as *4 x (4 + 1px spacing)* pixels. All of those pixels are saved in the `pixel` array:

~~~js
Snake.UI = {
    pixels: [],
	pixelsPerCell: 4
};

Snake.UI.initPixels = function(state) {
	this.pixels = [];

	//initialise array of empty pixels
	for (var x = 0; x < state.boardWidth * this.pixelsPerCell; x++) {
		this.pixels.push(new Array(state.boardHeight * this.pixelsPerCell));
	}
};

Snake.UI.paintCell = function(x, y, color, cellPixels, isGlitched) {
	if (isGlitched && typeof isGlitched !== 'number') {
		isGlitched = 0.9;
	}

	for (var i = 0; i < this.pixelsPerCell; i++) {
		for (var j = 0; j < this.pixelsPerCell; j++) {
			if (cellPixels[j][i] && (!isGlitched || Math.random() < isGlitched)) {
				this.pixels[x * this.pixelsPerCell + i][y * this.pixelsPerCell + j] = color;
			}
		}
	}
};
~~~

In the `paintCell` method we just have to go through all of the pixels in given cell and set a proper color. Except in the situation when we want to glitch one cell, eg to show wall's piece as a portal. In that situation (??), there is no point of drawing all of the cell's pixels. That's why there is a random number generated in the condition before setting the color. If that number is bigger than `0.9`, which happens in 10% of situations, than current pixel is not drawn. This gives us nice and little flickering effect.

As mentioned before, each of the cells are represented as *4 x 4* pixels. This is how food looks like:

~~~js
Snake.UI = {
    food: [
       [       ],
       [ , ,1  ],
       [ ,1, ,1],
       [ , ,1  ]
    ]
};
~~~

The `paintPixels` method looks like this:

~~~js
Snake.UI.paintPixels = function() {
	var pixelWidth = (this.cellSize - this.pixelsPerCell) / this.pixelsPerCell;
	var pixelSpacing = 1;
	if (Snake.Game.state.mode === 'tron') {
		pixelWidth += 1;
		pixelSpacing = 0;
	}
	var ctx = this.ctx;
	this.pixels.forEach(function(column, x) {
		column.forEach(function(pixel, y) {
			if (pixel) {
				ctx.fillStyle = pixel;
				ctx.fillRect(x * (pixelWidth + pixelSpacing), y * (pixelWidth + pixelSpacing), pixelWidth, pixelWidth);
			}
		});
	});
};
~~~

Each cells are drawn as a 16 pixels with additional empty spacing in a standard mode. The TRON mode looks little more futuristic, that's why there is no space between cells.
After setting the pixel's width and spacing values, we just go through each of the pixels and draw them on canvas with a standard `ctx.fillRect` method.

<div class='image left'>
<img src='/assets/sliding_puzzle/folder.png' alt='Each cells are drawn as 4 x (4 + 1px) pixels'>
<span class="caption">Each cells are drawn as 4 x (4 + 1px) pixels</span>
</div>

Introducing `pixels` and `board` array helped us implementing collision checking much easier and faster.
Before refactor the collision checking with walls looked like this:

~~~js
Snake.Game.ifCollided = function(snakeX, snakeY, walls) {
    var i;
    //check if the snakeX/snakeY coordinates exist in the walls' array
    for (i = 0; i < walls.length; i++) {
        if (walls[i].x === snakeX && walls[i].y === snakeY && !walls[i].isGlitched) {
            return true;
        }
    }
};
~~~

And after refactor it was just one line solution:

~~~js
if (this.state.board[snakeX][snakeY].type === 'wall') {
    //collision detected
}
~~~

The aforementioned big refactor (???) made easier for us to introduce features like flickering walls, pixelated fonts and glitched board. This is how we glitched whole columns:

~~~js
Snake.UI.glitchPixels = function() {
	var state = Snake.Game.state;

	for (var g = 0; g < state.level - 1; g++) {

		//how far move the pixels
		var glitchOffset = Snake.Game.random(0, state.level - 1);

		//group of how many columns to move
		var glitchWidth = Snake.Game.random(1, state.boardWidth * this.pixelsPerCell / 2);

		//direction of move
		var rand = Math.random();

        //which column to move
		var column = Snake.Game.random(0, state.boardWidth * this.pixelsPerCell - 1 - glitchWidth);

		for (var w = 0; w < glitchWidth; w++) {
			var x = column + w;
			for (var o = 0; o < glitchOffset; o++) {
				if (rand < 0.01) { //move column to the left
					var pixel = this.pixels[x].shift();
					this.pixels[x].push(pixel);
				} else if (rand > 0.99) { //move column to the right
					pixel = this.pixels[x][state.boardHeight * this.pixelsPerCell - 1];
					this.pixels[x].unshift(pixel);
				}
			}
		}
	}
};
~~~

The glitched graphic feature's purpose is to make it little harder to control your snake. The amount of glitches increases during the play.
In every game loop, just before painting the pixels, we try to glitch a number of columns. That number equals to the level achieved by the user (which increases every 5th consumed food).
So if the user reached for example 3rd level, the game will try 3 times to glitch a random amount of columns. In order to do that, we have to calculate the distance of how far to move those columns and how many of them should be altered.
Then the random number is generated and based on that we know the direction of the movement. The probability of moving columns either to the left (*< 0.01*) or to the right (*> 0.99*) is rather low but if the level is high, there is more chances of generating one or another direction. Also, the amount of glitched columns increases with the level.
We have to remove the first **column** from the **rows array** and add it to the end of the same array. This operation will move all of the columns to the left.
Moving columns to the right is little easier. We just have to copy the last value from the **rows array** and place it at the beginning of the same array.

I hope that the above code snippet didn't scare you ;). The following examples will be much easier.

### The TRON mode

While reading the [Wikipedia's page][wiki] about the classic Snake game something interesting occurs to us. It seems that some of the original Snake games had slightly different rules:

> In some games, the end of the trail is in a fixed position, so the snake continually gets longer as it moves.

I really liked the various bugs that gave extra points in the second version of the Nokia's 3310 Snake game. The wiki's quote gave us the idea for another glitch. Let's have a secret mode which will be triggered only after eating a bug. Bugs are generated on the at least second level of the game and there is only 30% chance that it will be shown on the board. And even then, there is a limited amount of time after which the bug will disappear. So it's rather difficult to get it but when the user will success, he/she will enter the special mode which we called the TRON mode (guess why?) during which the tail will stay in one place and snake will start to increase as long as it will reach the normal (non bug) food.
It may seem to be difficult but the biggest advantage of that mode is that for each time when Snake grows, it get extra points. Thus this is the best method to gain lot's of points and break some records.

<div class='image left'>
<img src='/assets/sliding_puzzle/folder.png' alt='TRON mode'>
<span class="caption">After eating the bug, SnAkE enters the TRON mode</span>
</div>

Here is how the Snake works after entering the TRON mode:

~~~js
Snake.Game.update = function() {
    switch (this.state.board[snakeX][snakeY].type) {

        //if the new head position matches the food
        case 'food': this.consumeFood(snakeX, snakeY);
            break;

        //if the new head position matches the bug
        case 'buggybug': this.consumeBuggyBug(snakeX, snakeY);
            break;

        default:
            if (this.state.mode === 'snake') {
                this.state.snake.shift(); // remove the first cell - tail

                // make it smaller in every paint
                if (this.state.prevLength && this.state.snake.length > this.state.prevLength) {
                    this.glitchSnakeTail(10, this.state.snake.length - this.state.prevLength);
                } else if (this.state.prevLength && this.state.snake.length === this.state.prevLength) { //no need to make it smaller anymore
                    this.state.prevLength = null;
                    this.state.glitchedLength = 0;
                }
            } else if (this.state.mode === 'tron') {
                this.state.score += 1; // score one point for every piece grown in tron mode
            }
            break;
    }

    this.state.snake.push({
        x: snakeX,
        y: snakeY
    });
}
~~~

If the snake's head position does not match either food or bug (or wall which is checked in a different place) it means that we can safe (??) move the snake. If we are in the TRON mode this is very easy. We just have to add one point for every new piece and push a new head's position into the existing **snake's array**.
Situation is little more complicated when we are not in the TRON mode anymore. The tail is not sticky anymore, so we have to remove it from the **snake's array**. This tail will be the new head. But before pushing it into the same array, we have to remember about making it smaller. While entering the TRON mode we saved the current length of the snake as a variable `prevLength`.
After leaving the TRON mode, we also have to decrease the length of Snake by 10 pieces until the `prevLength` value will be zero again and the snake's length will be the same as before entering the TRON mdoe.



###Conclusion

That's it for now. I shared with you some interesting parts of the SnAkE game but there is a lot more delicious staff like calculating the timer of the bugs, drawing pixel fonts or handling key inputs. You can dig into the code base in the [main repository][repo]. As always let me know if you have any questions in the comments' section below.

[swift]: http://zofiakorcz.pl/swift-my-first-arcade-canvas-game
[Js13kGames]: http://js13kgames.com/
[bartaz]: https://twitter.com/bartaz
[buggySnake]: http://js13kgames.com/entries/buggy-snake
[repo]: https://github.com/Calanthe/snake13k
[wiki]: https://en.wikipedia.org/wiki/Snake_(video_game)