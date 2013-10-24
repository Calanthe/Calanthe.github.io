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

The `drawInfo()` function is the easiest part of whole game. It is jast a simple function responsible for drawing information about user's status: current level and the amount of available lives. I used standard `fillStyle`, `font` and `fillText` `canvas's` methods and properties.

{% highlight js %}
function drawInfo(){
	var i=_lvl+1;
    _context.fillStyle = "#FFFFFF";
    _context.font = "bold 16px Arial";
    _context.fillText("Level "+i, 10, 585);
    _context.fillText("Lives", 90, 585);

    for(i=1; i<=_lives; i++){
            Ship.draw(125+(i*20),580,1);
    }
}
{% endhighlight %}

The whole code responsible for drawing the ship is placed within the (surprisingly!) `Ship` object. As you probably noticed so far, the ship is represented as a standard red or grey triangle. It's not my intention here to show how to draw basic shapes in `canvas` element. If you need to catch up with that, you can start with my [Introduction to HTML5 canvas element][canvas_introduction] article.

###Drawing levels and special lines



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