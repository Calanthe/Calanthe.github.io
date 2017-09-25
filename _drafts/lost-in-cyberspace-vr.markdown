---
layout: post
title: "Lost in Cyberspace Co-op VR game"
date:   2017-09-15 12:26:00
image: <img src='/assets/cyberspace/lost_in_cyberspace.jpg' alt='Lost in Cyberspace Co-op VR game'>
---
<div class='image right'>
<img src='/assets/cyberspace/lost_in_cyberspace.jpg' alt='Lost in Cyberspace Co-op VR game'>
<span class="caption">Lost in Cyberspace Co-op VR game</span>
</div>
This year, [Js13kGames][Js13kGames] contest has a new category called: `A-Frame`. [A-Frame][aframe] is a library that helps building virtual reality experiences. Together with [Bartek][bartaz] we decided to try it and build a cooperative game around a theme of `Lost`.
I want to share with you some interesting fragments and pitfalls we encountered during developing [Lost in CYBERSPACE][LostinCyberspace].

<!--more-->

The game is dedicated for 2 players only. The aim is to cooperate together to reveal the cyberspace’s map and hack a specific node. One of the player takes role of a hacker who enters the virtual reality maze, wonders around and give the other player found codes. Another player - a navigator, uses terminal and enters the codes received from the hacker. Dependently on the number and type of code, navigator reveals the map of the cyberspace and gives instructions about connections, traps and target to the hacker. The most important part of the game is good and fast communication between the players.

Let’s dive now into some interesting fragments from the codebase.

### Generating random network

Every time when a player starts a new game, the new network is randomly generated. The whole maze's structure has to be computed in such way that it may be encoded into 4 codes and easily decoded in the terminal. That's why it is represented by an object with 4 parameters: `connections`, `sectors` (also called as `colors`), `traps` and `target`. Those 4 values are later on used to calculate code values shown in the maze.

Based on that object, the 3d VR maze is generated:

<div class='image center no-mobile'>
<img src='/assets/cyberspace/maze_from_top.png' alt='The maze shown in the inspector'>
<span class="caption">The maze shown in the A-Frame Inspector</span>
</div>

As you can see, there are 4 `sectors` in the maze, each of them shown in different colors: pink, yellow, blue and green. The orange thin lines cross the node where the camera is located and where the hacker starts their journey.

The `randomNetwork` method returns an object's representation of a maze

~~~js
function randomNetwork() {
  let traps = randomTraps();
  let target = randomTarget();
  let walls = randomWalls();

  while (
    // prevent target from appearing on traps
    traps.trapsXY.some((xy) => xy.join() === target.join()) ||
    // and make sure it appears in a dead end
    walls.connections[target[0]][target[1]] !== 1
  ) {
    traps = randomTraps();
    target = randomTarget();
  }

  return {
    colors: randomColors(),
    traps: traps,
    target: target,
    walls: walls
  };
}
~~~

As mentioned before, the `randomNetwork` method returns object's representation of a maze described by 4 parameters: `colors`, `traps`, `target` and `walls`. It is sufficient for `walls` and `colors` to be generated only once but `traps` and `target` have to be regenerated as long as they meet specific requirements. `Target` for instance cannot be placed in the same node with `trap` and it always has to be a dead end so it will be more challenging to reach it.

The `randomTraps()` method looks like this:

~~~js
function randomTraps() {
  let trapsSeed = [
    randomInt(16), //generate random integer from 0-15
    randomInt(16),
    randomInt(16),
    randomInt(16),
  ];

  return createTrapsObject(trapsSeed);
}

function createTrapsObject(trapsSeed) {
  let trapsXY = [];

  for (let i = 0; i < 4; i++) {
    // first seed is number 0-15 (from the code)
    let seed1 = trapsSeed[i];
    // second seed is computed as shifted sum of 2 next seeds
    let seed2 = (i*4 + trapsSeed[(i + 1) % 4] + trapsSeed[(i + 2) % 4]) % 16;

    // make sure both seeds are not the same (so traps don't overlap)
    if (seed1 === seed2) {
      seed2 = 15 - seed1;
    }

    [seed1, seed2].forEach(seed => {
      let xy = [seed % 4, ~~(seed / 4)];
      if (i === 1 || i === 3) {
        xy[0] = xy[0] + 4; // move x coord for sectors B and D
      }
      if (i === 2 || i === 3) {
        xy[1] = xy[1] + 4; // move y coord for sectors C and D
      }
      trapsXY.push(xy);
    });
  }

  return {
    trapsSeed: trapsSeed,
    trapsXY: trapsXY
  };
}
~~~

First, four random integers which represents a sector are computed and saved into `trapsSeed` array. There are 16 nodes in each quarter of the maze, so the random range is from 0 to 15. The `traps'` coordinates in all of the `sectors` are based on 2 `seed` values. The first one is just a previously generated integer. The second `seed` is calculated as shifted sum of 2 next integers from the `trapsSeed` array. Then, after making sure that traps won't overlap, each of the `seed` is used to calculate the coordinates of `traps`. The coordinates' array called `xy` is built based on `seed` value modulo 4 and the integer value of `seed` divided by 4. The last thing before pushing those coords to the returned array is to shift them by adding 4 towards either right or bottom dependently on the current sector.  

The above example shows a method of generating `traps` object only. For the sake of simplicity I will omit the whole method of generating maze's object.

### Creating unique shared codes

One of the trickiest part of the game was generating the unique codes in such a way that they will correspond to each other in two remote devices.
There is no unique url parameter or any id that has to generated and shared between a pair of players. The magic lies in the method of generating the codes found on nodes in the maze.

As mentioned before, each maze is described by 4 parameters: `connections`, `sectors`, `traps` and `target`. Based on the network's object representation, the unique codes for each of those parameters are generated and hidden in the maze, one in each sector.

<div class='image center no-mobile'>
<img src='/assets/cyberspace/code_in_maze.png' alt='Example code found in the maze'>
<span class="caption">Example code found in the maze</span>
</div>

Each of such codes `0xTCCCC` has the same structure:
- `0x` prefix to make it looks fancy ;),
- `T` hex value [0-F] defining type of the code. `T % 4` gives a number 0-3: (0: colors, 1: walls, 2: traps, 3: target)
- `C` 4 hex values [0-F] defining the code value (depends on the code type)

This is how to generate such a code:

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

As mentioned before, the code consists of the `0x` prefix, `type` and `color` values. The `type` is a hex value of randomly generated number from 1-4, multiplied by 4 and added to a specific `n` number, in this example - `0`. The rest of a division by 4 of such number will give `0`. During decoding, it will be a decisive information about the `type` of a given code.
The last part of the code is the value. It is a string combined with a hex values generated the same way as `type`, where the added `n` number is just the value given in the `colors` object - one per each sector.

After finding the code, hacker shares it with the navigator who enters it into the terminal. If entered codes are valid, the exact same maze should be shown in the terminal. Based on that the navigator may conclude where the hacker currently is and guide them to the target node.

### Decoding unique shared codes

When the navigator enters the code to the terminal, it is decoded, interpreted and shown on the map. The decoding method of colors is just the reverse of encoding:

~~~js
function networkFromCodes(codes) {
(...)
parsed = parseCode(code);

if (parsed) {
  let type = parsed.shift() % 4;

  try {
    switch(type) {
      case 0:
        network.colors = decodeColors(parsed);
        network.colors.code = code;
        break;
        (...)
}


function parseCode(code) {
  code = code
    .replace('0x','')
    .split(''); // turn into array of hex characters

  if (code.length !== 5) {
    throw new Error('Code length is not valid.');
  }

  code = code
    .map(x => parseInt(x, 16)) // parse hex values
    .filter(n => !isNaN(n)); // get only numbers

  if (code.length !== 5) {
    throw new Error('Code contains invalid characters');
  }

  return code;
}

function decodeColors(values) {
  let colors = values.map(n => n % 4);

  let hasDuplicates = colors.some((c,i) => colors.indexOf(c) !== i);

  if (hasDuplicates) {
    throw new Error('Duplicated colors in different sectors');
  }

  return colors;
}
~~~

In the `parseCode` method, the `0x` prefix is removed and the rest of the code is split into array of hex characters. Then each of the character is parsed into integer number. If there is no invalid characters, the `parseCode` method returns array of parsed values. The first value in the returned array indicates `type`. If the rest from the division of `type` and 4 equals `0`, the `decodeColors` method is called. The body of that function just goes through every value indicating `color` and calculates it modulo 4. Before returning decoded `sectors`, the `decodeColors` method validates if all of the `colors` are unique.

Here is the example of a valid color code:

~~~js
// 0xC16F8
// C % 4 = 0 (code's type defines color, C for color ;)
// 1 % 4 = 1 (color of sector A is 1)
// 6 % 4 = 2 (color of sector B is 2)
// F % 4 = 3 (color of sector C is 3)
// 8 % 4 = 0 (color of sector D is 0)
~~~

and incorrect one:

~~~js
// 0x44206
// 4 % 4 = 0 (code's type defines color)
// 4 % 4 = 0 (color of sector A is 0)
// 2 % 4 = 2 (color of sector B is 2)
// 0 % 4 = 0 (color of sector C is 0)
// 6 % 4 = 2 (color of sector D is 2)
// Code is invalid as it has duplicated colors
~~~

I only demonstrated `colors` here but `connections`, `traps` and `target` are implemented in a quite similar way.

After entering correct code, the maze's map is shown in the terminal.

<div class='image center no-mobile'>
<img src='/assets/cyberspace/map_terminal.png' alt='The mazes map is shown in the terminal'>
<span class="caption">The mazes map with revealed sectors shown in the terminal.</span>
</div>

The more hints are shown on the terminal map, the easier for hacker is to reach the correct node and hack it.

### Conclusion

I hope that you've learnt something today and maybe even felt motivated to try building a VR game by your own. I intentionally didn't show any fragments of `A-Frame` code because I wanted to focus on the most crucial parts of the game, not the library itself. If you are willing to learn it's basics, here is a [A-Frame examples' page][aframe-examples] and an [introduction tutorials][intro-aframe] to start with.

If you have any questions about the [Lost in Cyberspace][LostinCyberspace] game, investigate its [codebase][repo] by yourself and as always feel free to ask about it in the section below.

[Js13kGames]: http://js13kgames.com/
[LostinCyberspace]: http://js13kgames.com/entries/lost-in-cyberspace
[bartaz]: https://twitter.com/bartaz
[aframe]: https://aframe.io/
[repo]: https://github.com/bartaz/lost-in-cyberspace
[aframe-examples]: https://altspacevr.github.io/aframe/examples/
[intro-aframe]: https://aframe.io/docs/0.6.0/introduction/
