---
layout: post
title: "Swift - my first arcade canvas game"
date:   2013-10-26 19:34:06
---
![Swift - arcade game]({{ site.url }}/assets/duckhunt.jpg)  

This time I would like to show you how easly you can develop a simple arcade game in [canvas][canvas]. As a example, I will use a [Swift game][swift_game] which I made for 2012's edition of [JS13KGames][jsk13_games]. 

<!--more-->

It's important to mention, that the whole mechanics of this game is strongly inspired by [the Swift Stitch game][original_swift] made by [Sophie Houlden][sophiehoulden]. I found her game very entertainment, because of the perfect combination of easy to learn rules and hard to play gameplay. I thought this will be a nice example to build similar game with almost the same rules and easier and custom levels. If you find my version of game too easy and want to play something more challengeable - give a try to the original [Swift Stitch game][original_swift_demo]. The real fun starts when you reach 'gravity' levels ;).

###The game loop

The game loop is according to [Wikipedia][wiki_game] and [gamedev.tutplus][gamedev_loop], the central component of any game, which is responsible to keep your game runnig. Within that infinite loop, all actions like: rendering level, player or enemy, counting scores, resolving collisions, detecting user's input or playing sounds are taken care of? 

{% highlight js %}
function run(){
  animationId = requestAnimationFrame(run);
  animate();
}
{% endhighlight %}

{% highlight js %}
function animate(){
	_context.clearRect(0, 0, 800, 600);                
	                        
	//draw information about current level and lives
	drawInfo();

	//draw change mode lines, last one is end of level
	drawChangeModeLines();

	//show ship                
	Ship.draw(_posX,_posY,0);

	//draw level
	drawLevelShape();

	//set shift variables for next animation step
	moveWholeLevel();
	                        
	//check if ship is on change mode line
	//if yes, then change _up or _right mode
	changeModesOnSpecialLines();
	        
	//stop the game when ship hits the wall        
	detectCollision();
}
{% endhighlight %}

I think that the above code speak for itself. The `requestAnimationFrame()` function is an API for performing optimized animations in browsers. It's the best alternative to commonly used but not so efficient `setInterval()` function. For the better understanding, I recommend you to get know with [the Paul Irish's post][paul_irish] first.

During the animation (so every 1000/60 ms) whole computing defined in `animate()` is executed. First the `canvas` needs to be cleared, then every game's element is drawn, included: information about current level and player's lives, a ship which the user controls, borders of level and special lines, on which the ship changes its direction. 

The `drawInfo()` function is the easiest part of the whole game. It is jast a simple function responsible for drawing information about user's status: current level and the amount of available lives. I used standard `fillStyle`, `font` and `fillText` `canvas's` methods and properties to show subtitles.

The whole code responsible for drawing the ship is placed within the (surprisingly!) `Ship` object. As you probably noticed so far, the ship is represented as a standard red or grey triangle. It's not my intention here to show how to draw basic shapes in `canvas` element. If you need to catch up with that, you can start with my [Introduction to HTML5 canvas element][canvas_introduction] article.

###Drawing levels and special lines

Lets continue with something more interesting. The most important part of this game is the mechanism to draw different levels in such way, that it will be easy enought to detect if the ship hits the border. I also had to have in mind, that the size of my game is limited to 13 kilobytes. As you see, proper method of drawing and detecting borders of levels was essential part of the implementation. After at least few hours of intensive thinking, I came across my [JS1K 'Love' demo][js1k] and I remembered one particular `canvas` method, which turned out to be my perfect solution: `isPointInPath()`. All I needed to do afterwards, was to:

1. Draw a large geometric black figure with only white visible borders, so it could imitate whole level. 
2. Place the ship inside of that figure.
3. During the animation, use `isPointInPath()` to check if ship's position is in path of the of the drawn figure (level).

This is it! I didn't need to detect collisions with borders by myself, because `canvas` already implemented useful `isPointInPath()` method. After figuring it out, I could finally focus on drawing custom level shapes.

I used an `array` of `objects` to store important information about each level, which are represented by coordinates of all points connecting the figure. First level is stored as followed:

{% highlight js %}
_level = [
	        [{x:0,y:100},{x:1000,y:100},{x:1000,y:600},{x:1400,y:600},{x:1400,y:1200},
	        {x:1800,y:1200},{x:1800,y:1400},{x:1200,y:1400},{x:1200,y:800},{x:800,y:800},
	        {x:800,y:300},{x:0,y:300},{x:0,y:100}]
		],
{% endhighlight %}


[canvas]: http://diveintohtml5.info/canvas.html
[swift_game]: http://js13kgames.com/entries/swift
[jsk13_games]: http://js13kgames.com/
[original_swift]: http://swiftstitch.sophiehoulden.com/
[sophiehoulden]: http://www.sophiehoulden.com/
[original_swift_demo]: http://swiftstitch.sophiehoulden.com/demo/
[wiki_game]: http://en.wikipedia.org/wiki/Game_programming
[gamedev_loop]: http://gamedev.tutsplus.com/articles/glossary/quick-tip-what-is-the-game-loop/
[paul_irish]: http://www.paulirish.com/2011/requestanimationframe-for-smart-animating/
[canvas_introduction]: http://www.cognifide.com/blogs/ux/introdution-to-html5-canvas-element/
[js1k]: http://js1k.com/2012-love/demo/1139