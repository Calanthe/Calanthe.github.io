---
layout: post
title: "Buggy SnAkE for the Js13kGames"
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

This year's theme of the [Js13kGames][Js13kGames] competition is `Glitch`. We came up of ?differently? idea to create a well known classic game and add some glitches to it. We choose Snake because of two major reasons. It is one of the easiest game to do in canvas. And also because of more nostalgic reason: I loved the Snake 2 game originally released on Nokia 3310 phone. I used to spend lot's of time mastering it when I was younger, mostly while waiting for a bus or during longer trips.
It was also important to do something that people know and recognise. I am aware (also from my own experience) that sometimes people are too lazy to read rules of a new game. It is not very practical to do complicated entry for contests like [Js13kGames][Js13kGames], where people want to play and test as many different games as possible.

### How to program the standard Snake game?
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