---
layout: post
title: "Swift - my first arcade canvas game"
date:   2013-10-26 19:34:06
---
![Swift - arcade game]({{ site.url }}/assets/duckhunt.jpg)  

This time I would like to show you how easly you can develop a simple arcade game in [canvas][canvas]. As a example, I will use a [Swift game][swift_game] which I made for 2012's edition of [JS13KGames][jsk13_games]. 

<!--more-->

It's important to mention, that the whole mechanics of this game is strongly inspired by [the Swift Stich game][original_swift] made by [Sophie Houlden][sophiehoulden]. I found her game very entertainment, because of the perfect combination of easy to learn rules and hard to play gameplay. I thought this will be a nice example to build similar game with almost the same rules and easier and custom levels. If you find my version of game too easy and want to play something more challengeable - give a try to the original [Swift Stich game][original_swift_demo]. The real fun starts when you reach 'gravity' levels ;).

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

During the animations (so every 1000/60 ms) whole computing defined in `animate()` is executed.  

[canvas]: http://diveintohtml5.info/canvas.html
[swift_game]: http://js13kgames.com/entries/swift
[jsk13_games]: http://js13kgames.com/
[original_swift]: http://swiftstitch.sophiehoulden.com/
[sophiehoulden]: http://www.sophiehoulden.com/
[original_swift_demo]: http://swiftstitch.sophiehoulden.com/demo/
[wiki_game]: http://en.wikipedia.org/wiki/Game_programming
[gamedev_loop]: http://gamedev.tutsplus.com/articles/glossary/quick-tip-what-is-the-game-loop/
[paul_irish]: http://www.paulirish.com/2011/requestanimationframe-for-smart-animating/