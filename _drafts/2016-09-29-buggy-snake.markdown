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
In this article I want to talk about the most interesting programming challenges and ideas we came of during development of the [buggy SnAkE game][buggySnake].

<!--more-->

This year's theme of the [Js13kGames][Js13kGames] competition is `Glitch`. We had an idea to create a well known classic game and add some glitches to it. We choose Snake because it is one of the easiest game to do in canvas. And also because I loved the Snake 2 game originally released on Nokia 3310 phone. I used to spend lot's of time mastering it when I was younger, mostly while commuting to school.
It was also important to do something that people know and recognise. I am aware (also from my own experience) that sometimes people are too lazy to read rules of a new game. It is not very practical to do complicated entry for contests like [Js13kGames][Js13kGames], where people want to play and test as many different games as possible.

I think that there is no need to explain the rules of classic Snake in much details. Simply as that: player has to control the snake and collect food in order to get more points. Our SnAkE version has three additional features though: **glitched graphic**, the **TRON mode** and the **ability to go through walls**. The glitched graphic feature's purpose is only to make game little harder. The amount of glitches increases during the play

I will describe later on in more details how those glitches were implemented. ??

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

In order to easily implement glitched and retro like graphic, we had to divide the whole canvas into `20 x 20 px` cells. The whole board (including score points, HI score and bug's timeout at the top) is represented as a `two dimensional Array` (2d Array??):

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

Now the painting algorithm is quite straightforward:

~~~js
Snake.UI.paint = function(state) {
(...)
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

We just have to go through the main `board` array and paint the elements (wall pieces, food and bugs) in a proper place, with given graphic style and defined color:

~~~js
Snake.UI = {
    pixels: [],
	pixelsPerCell: 4
};

Snake.UI.initPixels = function(state) {
	this.pixels = [];
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

For example food is represented as:
~~~js
food: [
			[       ],
			[ , ,1  ],
			[ ,1, ,1],
			[ , ,1  ]
		],
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


How collision checking improved with the 2dim array and paintCell? glitchy walls, fonts, whole board glitched
it was also easy to draw a flickering portal which allows snake to go through.

Having board's cells stored like that we can now use micro fonts.

mention about the BOSS?

<div class='image left'>
<img src='/assets/sliding_puzzle/folder.png' alt='TRON mode'>
<span class="caption">After eating the bug, SnAkE enters the TRON mode</span>
</div>


{% highlight js %}

var game = new Phaser.Game(800, 600, Phaser.CANVAS,
'slidingpuzzle', { preload: preload, create: create });

{% endhighlight %}

###Conclusion

That's it! You've created a very easy puzzle game in `Phaser` using many of the built-in capabilities of the framework. If you want to explore further you could try implementing scores, an option to change the background image or functionality to share your best score on facebook.

[swift]: http://zofiakorcz.pl/swift-my-first-arcade-canvas-game
[Js13kGames]: http://js13kgames.com/
[bartaz]: https://twitter.com/bartaz
[buggySnake]: http://js13kgames.com/entries/buggy-snake