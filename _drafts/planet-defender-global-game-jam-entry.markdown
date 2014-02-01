---
layout: post
title: "Planet Defender - a 2014 Global Game Jam entry"
date:   2014-01-02 15:56:06
---
![Planet Defender]({{ site.url }}/assets/planet_defender/planet_defender.jpg)

The third weekend of January was the coldest (so far) time of 

<!--more-->

It's important to mention, that all of the mechanics of this game is strongly inspired by [the Swift Stitch game][original_swift] made by [Sophie Houlden][sophiehoulden]. I found her game very entertaining, because of the perfect combination of easy to learn rules and hard to play gameplay. I thought this could be a nice example to build a similar game with almost the same rules and easier and customized levels. If you find my version of the game too easy and want to play something more challenging - give the original [Swift Stitch game][original_swift_demo] a try. The real fun starts when you reach 'gravity' levels ;).

###The game loop

The game loop, according to [Wikipedia][wiki_game] and [gamedev.tutplus][gamedev_loop], is the central component of any game, which is responsible for keeping your game runnig. Within that infinite loop, all actions like: rendering a level, player or enemy, counting scores, resolving collisions, detecting user's input or playing sounds are taken care of.

{% highlight js %}
function run(){
  animationId = requestAnimationFrame(run);
  animate();
}
{% endhighlight %}

###Drawing levels and special lines

When any side of the ship hits the border of level, then the whole game animation is stopped and the total amount of player's lives is reduced. If the user still has any lives left, he/she can face the current level again. Otherwise, the player is forced to start whole game from the beginning.

###Conclusion

[canvas]: http://diveintohtml5.info/canvas.html