---
layout: post
title: "Planet Defender - a Global Game Jam'14 entry"
date:   2014-02-01 15:56:06
---
![Planet Defender](./assets/planet_defender/planet_defender.jpg)

The third weekend of January was the coldest in Poland (so far!) time of passing winter. Temperature in Poznań hit -11°C during the day. In such conditions, the best way to spend free time
is to stay at home and enjoy the advantages of comfortable and warm bed ;). But this weekend was special for the game makers from all over the world. The [Global Game Jam][ggj] was taking place and I couldn't miss that!

<!--more-->

[Poznań Global Game Jam][pggj] edition took place in [Politechnika Poznańska][pp]. Over forty enthusiastic people participated in this event to within 48 hours make glorious games.
The main theme of this year's jam, was 'We don't see things as they are, we see them as we are'. Because of the differences in time zones, organizers announced it few hours after we already started implementing our ideas.
The prototype version of our game was almost working at that time, so the better solution was, to focus on delivering what we have already started.

My team (me & [@lukaszwojciak][wojciak]) decided to learn something new and related to circle geometry, so we got an idea, to implement game similar to classic Space Invaders, but with a planet behind the main character, so he/she can protect it.
We had some problems with defining the main character, but at the end we came to conclusion, that the easiest to implement and animate will be a simple pyramid, which will imitate the egyptian God Ra.

Similar to [Purrfect][purrfect_article], we used [Spine][spine] and [Pixi.js][pixi] to animate and render graphic assets. In his article I would like to focus mainly on circle geometry and all of the mathematics which is necessary to understand the rotation of the planet and collision between the planet and meteors.

###Introduction to circle geometry

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

[ggj]: http://globalgamejam.org/
[pggj]: http://globalgamejam.org/2014/jam-sites/poznan-game-jam?destination=node/348
[pp]: http://www.put.poznan.pl/
[wojciak]: https://twitter.com/lukaszwojciak
[purrfect_article]: http://zofiakorcz.pl/purrfect-game/
[spine]: http://esotericsoftware.com
[pixi]: http://www.pixijs.com/