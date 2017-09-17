---
layout: post
title: "Lost in Cyberspace Co-op VR game"
date:   2017-09-15 12:26:00
image: <img src='/assets/snake/snake.jpg' alt='Lost in Cyberspace Co-op VR game'>
---
<div class='image right'>
<img src='/assets/snake/snake.jpg' alt='Lost in Cyberspace Co-op VR game'>
<span class="caption">Lost in Cyberspace Co-op VR game</span>
</div>
In this year, [Js13kGames][Js13kGames] contest has a new category: `A-Frame`. [A-Frame][aframe] is a library that helps building virtual reality experiences. Together with [Bartek][bartaz] we decided to try it and build a cooperative game around a theme of `Lost`.
Let me share with you some pitfalls we encountered during developing [Lost in CYBERSPACE][LostinCyberspace].

<!--more-->

The game is dedicated for 2 players only. Their aim is to cooperate together to reveal the cyberspace’s map and hack a specific node. One of the player takes role of a hacker who enters the virtual reality maze, wonders around and give the other player found codes. Another player - a navigator, uses terminal and enters the codes received from the hacker. Dependently on the number and type of code, navigator reveals the map of the cyberspace and gives instructions about connections, traps and target to the hacker. The most important part of the game is good and fast communication between the players.

Let’s dive now into some interesting fragments from the codebase.

### Generating unique shared codes

One of the most trickiest part of the game was generating the unique codes in such a way that they will correspond to each other in a two remote devices.
There is no unique url parameter or any id that has to generated and shared between a pair of players. The magic lies in the method of generating the codes found on nodes in the maze.

First, the random maze is generated on the VR device. For the sake of simplicity I will show only the most important parts of the code base and the algorithm of generating unique shared codes.

This is how the example maze looks like in the [A-Frame Inspector][aframeinspector]:

<div class='image center no-mobile'>
<img src='/assets/cyberspace/maze_from_top.png' alt='The maze shown in the inspector'>
<span class="caption">The maze shown in the A-Frame Inspector</span>
</div>

As you can see, there are 4 sectors in the maze, each of them shown in different colors: pink, yellow, blue and green. The orange thin lines cross the node where the camera is located and where the hacker starts his/her journey.
The network's object representation may look like this:

<div class='image no-mobile'>
<img src='/assets/cyberspace/cyberspace.png' alt='The networks object representation'>
<span class="caption">The network's object representation</span>
</div>

Each maze is described by 4 parameters: `connections`, `sectors` (can be also called as `colors`), `traps` and `target`. Based on the network's object representation, the unique codes for each of those parameters are generated and hidden in the maze, one in each sector.

<div class='image center no-mobile'>
<img src='/assets/cyberspace/code_in_maze.png' alt='Example code found in the maze'>
<span class="caption">Example code found in the maze</span>
</div>

Each of such codes `0xTCCCC` has the same structure:
- `0x` prefix to make it looks fancy ;),
- `T` hex value [0-F] defining type of the code. `T % 4` gives a number 0-3: (0: colors, 1: walls, 2: traps, 3: target)
- `C` 4 hex values [0-F] defining the code value (depends on code type)

Generating the code for colors looks like this:

~~~js
function hexRandomMod4(n) {
  return (n + randomInt(4) * 4).toString(16).toUpperCase();
}

function colorsToCode(colors) {
  let type = hexRandomMod4(0);
  let code = '0x' + type + colors.map(hexRandomMod4).join('');

  return code;
}
~~~

The code consists of `0x` prefix, a type which is a randomly generated number from 1-4 multiplied by 4 and 

After finding the code, hacker shares it with the navigator who enters it into the terminal.

### Conclusion

You can learn some basics about the A-Frame library here https://aframe.io/docs/0.6.0/introduction/.

That's it for now. I shared some interesting parts of the SnAkE game but there is a lot more delicious staff like calculating the timer of the bugs, drawing pixel fonts or handling key inputs. You can dig into the code base in the [repository][repo]. As always let me know if you have any questions in the comments section below.

[Js13kGames]: http://js13kgames.com/
[LostinCyberspace]: http://js13kgames.com/entries/lost-in-cyberspace
[bartaz]: https://twitter.com/bartaz
[aframe]: https://aframe.io/
[aframeinspector]: https://github.com/aframevr/aframe-inspector
[repo]: https://github.com/bartaz/lost-in-cyberspace
