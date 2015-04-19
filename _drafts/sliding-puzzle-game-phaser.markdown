---
layout: post
title: "Sliding puzzle game in Phaser"
date:   2014-05-06 21:34:04
---
![Sliding puzzle game in Phaser]({{ site.url }}/assets/duckhunt.jpg)

The popularity of the [Phaser][phaser] game framework grows rapidly this days. Lets focus on the very basics of this library by creating a simple [puzzle sliding game][sliding-puzzle].

<!--more-->

As you probably already know, the `Phaser` is one of the most popular free JavaScript framework made by the [Photonstorm][photonstorm]. Its purpose is to help developers creating HTML5 games really quickly, by providing a set of tools which handle generic tasks (like loading images, game loop, inputs, physics) needed to program the game. Having that, the developer can focus on the game idea itself, not wasting a time on rewriting or copying the same code between previous projects.

###The set up and initialization

Because of the nature of JavaScript and browser's security features, we have to run server to load resources required by the game. There is a [few possibilities][servers] how to do that but my favourite one is [Grunt][grunt] task runner and [Yeoman][yeoman] scaffolding tool.
A found a nice [Yeoman generator for Phaser][yeogen] and updated it with the newest `Phaser` version and amended the `gruntfile` file. You can check and use my current (still working in progress) setup in [Github][github]. If it's easier for you, you can also investigate the source code in the working [sliding puzzle game][sliding-puzzle].

Once we have everything set up and ready, lets dive into the initialization of the `Phaser` framework. Our main folder consists only of the `index.html` file and `js`, `css` and `assets` folders.
![Folder structure for Phaser](/assets/sliding_puzzle/folder.png)

In the `index.html` we need to include the aforementioned assets:

{% highlight html %}

<!doctype html>
<head>
  <title>SlidingPuzzle</title>
  <link href="css/styles.css" rel="stylesheet" type="text/css">
</head>
<body>
  <div id="slidingpuzzle"></div>
  <script src="js/phaser.js"></script>
  <script src="js/game.js"></script>
</body>
</html>

{% endhighlight %}

As you can see, there is a `div` element with the `slidingpuzzle` id attribute. In our `game.js` file that id refers to the element where we want to initialize the `Phaser` framework.

{% highlight js %}

var game = new Phaser.Game(800, 600, Phaser.CANVAS,
'slidingpuzzle', { preload: preload, create: create });

{% endhighlight %}

The above line shows how to initialize the `Phaser` instance, by setting a proper width and height, the method of rendering (it can be also Phaser.AUTO to detect WebGL with fallback to canvas), the aforementioned id of the parent element and the list of used states in game.

We have two states in the game: `preload` and `create`. They will be fired in the same order as they are specified. The `Phaser` allows to use more than those two, eg `boot` to show a loader but in this game we will use only two basic states.

In the `preload` state we will only load the image which will be our background in the game:

{% highlight js %}

var PIECE_WIDTH = 200,
    PIECE_HEIGHT = 200;

function preload() {
   game.load.spritesheet("background", "assets/bl.jpg", PIECE_WIDTH, PIECE_HEIGHT);
}

{% endhighlight %}

Our loaded spritesheet will be named `background` and it will be divided into frames 200x200 each. The canvas size is 800x600 so it means that on that board we will have 4 pieces in each row and 3 pieces in each column. This will be quite easy game so if you need a bigger challenge, change the `PIECE_WIDTH` and `PIECE_HEIGHT` to smaller values, like 100.

When the image will be loaded, `Phaser` will fire another state, `create` when we have `prepareBoard` method:

{% highlight js %}

var BOARD_COLS = Phaser.Math.floor(game.world.width / PIECE_WIDTH);
    BOARD_ROWS = Phaser.Math.floor(game.world.height / PIECE_HEIGHT);

piecesAmount = BOARD_COLS * BOARD_ROWS;

{% endhighlight %}

Based on the piece's size we can easily calculate the amount of pieces on the board.



[phaser]: https://phaser.io/
[photonstorm]: http://www.photonstorm.com/
[servers]: http://phaser.io/tutorials/getting-started/part2
[grunt]: http://gruntjs.com/
[yeoman]: http://yeoman.io/
[yeogen]: http://www.html5gamedevs.com/topic/5127-generator-phaser-official-yeoman-generator-for-phaser-projects/
[github]: https://github.com/Calanthe/PhaserSlidingPuzzle
[sliding-puzzle]: http://zofiakorcz.pl/PhaserSlidingPuzzle/