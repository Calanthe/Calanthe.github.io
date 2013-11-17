---
layout: post
title: "Purrfect - a Node Knockout'13 multiplayer game"
date:   2013-11-15 14:08:00
---
![Purrfect game]({{ site.url }}/assets/duckhunt.jpg)

[Node Knockout][nodenockout] is one of the most popular 48h, online hackaton featuring [node.js][node.js]. Together with my friends: [@mchmurski][mchmurski], [Ania][Ania] and [@lukaszwojciak][lukaszwojciak] we wanted to make a multiplayer, enjoyable game with a catchy idea - popular cat memes as a main characters! 

<!--more-->

The main purpose of the [Purrfect][purrfect] game is to jump as fast as you can to reach the highest (300th) level before other players do - for the cat's glory!. To run faster and jump higher, you can bounce off the walls or look for Nyan catnips powerup. After consuming a catnip, your cat is blessed by Nyan cat's rainbow power, and in conclusion it gets extra skill to reach very high areas.

The [Purrfect][purrfect] is a multiplayer game and it was written in both server-side ([node.js][node.js], [Socket.IO][socket.io], [express][express]) and client-side ([lithiumJS][lithium], [pixijs][pixijs], [Spine][spine]) technologies. In this article I will walk you through some of the most fundamental ones but I want to focus only on the client-side part of the implementation.

###Animations with Spine

The [Spine][spine] is an application which allows to easily create 2D skeletal animation for games. You have to prepare proper graphic assets by yourself - the whole character and separately all of the important parts of its body. Having this, you can prepare all character's animations used in the game. When finished, prepared animation can be exported in JSON or binary file and used easily in the further development. [This list of video tutorials][spinetutorials] should be very helpful if you want to understand this topic better.

As I mentioned before, we wanted to use famous cats to be our characters, which take part in a race. After choosing the most characteristic memes, the following assets have been prepared:

here will be img tutor? list of meme, big cat and avatar

Because of the limited, 48h time of the competition, we managed to animate only the chemical cat. On the following pictures, you can see examples of waiting and running animations used in the game:

here will be 2 animated cats - with captions?

###Rendering with Pixi.js

[Pixijs][pixijs] is a JavaScript framework, which renders 2d webGL fast graphic with canvas fallback. We decided to use this library, because since it supports Spine animations, it is the easiest solution to combine it with our animated cat.

This is how rendering basic stage and background looks in Pixi.js:

{% highlight js %}
//get canvas element
var canvas = document.querySelector('#canvas');

//PIXI will detect renderer (webGL or canvas fallback) automatically
var renderer = PIXI.autoDetectRenderer(800, 600, canvas);

//create PIXI container, which represents collection of display objects
var container = new PIXI.DisplayObjectContainer(); 

//A Stage represents the root of the display tree. 
//Everything connected to the stage is rendered
var stage = new PIXI.Stage(0x000000,false);
stage.addChild(container);

//now load and render background
var tiling = PIXI.Texture.fromImage('/img/game.png'),
    tilingSprite = new PIXI.Sprite(tiling),
    tiling2 = PIXI.Texture.fromImage('/img/starsFront.png'),
    tilingSprite2 = new PIXI.TilingSprite(tiling2, 800, 600),
    tiling3 = PIXI.Texture.fromImage('/img/starsMiddle.png'),
    tilingSprite3 = new PIXI.TilingSprite(tiling3, 800, 600),
    tiling4 = PIXI.Texture.fromImage('/img/starsBack.png'),
    tilingSprite4 = new PIXI.TilingSprite(tiling4, 800, 600);

var tilings = {
    bg: tilingSprite,
    sFront: tilingSprite2,
    sMiddle: tilingSprite3,
    sBack: tilingSprite4
};

stage.addChildAt(tilings.bg,0);

{% endhighlight %}

The followig snippet shows example code of how players are rendered:

{% highlight js %}
//first load exported Spine animation
var assets = ['/spine/skeleton.atlas', '/spine/skeleton.json'];

var loader = new PIXI.AssetLoader(assets);  
loader.onComplete = loaded;
loader.load();

//now create a Text object with name
var text = new PIXI.Text(player.name, {font: '16px Arial', fill: 'white'});

//for each player 
for (var item in players) {
    if (players.hasOwnProperty(item)) {
        id = players[item].id;

        //load Spine animation
        player[id] = new PIXI.Spine('/spine/skeleton.json');

        //set id, name and avatar
        player[id].id = id;
        player[id].name = players[item].name;
        player[id].avatar = players[item].avatarName;

        //render text with name above cat
        text.anchor.x = 0.5;
        text.anchor.y = 0.5;
        text.position.y = player.position.y;
        text.position.x = player.position.x;
        container.addChild(text);

        //scale cat and render it in a random horizontal position
        //in a specific (100px from top) vertical position
        player.nameTag = text;
        player.position.x = 80 * Math.random() * 10 + 1;
        player.position.y = 100;
        player.scale.x = 0.5;
        player.scale.y = 0.5;

        //set another values, which will be important to compute physics
        player.keyPressed = {};
        player.speedup = 0;
        player.lockJump = 0;
        player.fallingVelocity = 0;
        player.ground = 580;
        player.xspeed = 0;
        player.yspeed = 0;
        player.score = 0;
        player.oldY = 0;
        player.oldX = 0;

        //by default cat is in idle/waiting state
        player.state.setAnimationByName('idle', true);

        //if this is my cat
        if (players[item].id === myID) {

            //listen for key events to control cat
            $(document).keydown(function (e) {
                var k = e.keyCode;

                //when the left arrow is pressed, turn cat to the left
                if (k === 37) {
                    me.scale.x = -0.5;
                }

                //when the right arrow is pressed, turn cat to the right
                if (k === 39) {
                    me.scale.x = 0.5;
                }

                //change animation to running mode
                if (k >= 32 && k <= 40) {
                    me.flying = true;
                    me.state.setAnimationByName('animation', true);
                    e.preventDefault();
                }
            });

            $(document).keyup(function (e) {
                var k = e.keyCode;

                //change animation to idle/waiting mode
                if (k >= 32 && k <= 40) {
                    if (!me.flying) {
                        me.state.setAnimationByName('idle', true);
                    }
                }
            });
        }
    }
}
{% endhighlight %}

Very similar but little more fancy is with the Nyan catnips:

{% highlight js %}
//first load img with nyan cat and light effect
var powerup = new PIXI.Sprite(new PIXI.Texture.fromImage('/img/nyan.png')),
    powerItem = {},
    blend = PIXI.Sprite.fromImage('img/lighto.png');

    //set position based on values from server
    powerup.position.x = 80 * column;
    powerup.position.y = position;

    //set blend mode to gain fancy effect
    powerup.anchor.x = 0.5;
    powerup.anchor.y = 0.5;
    powerup.blendMode = 'w';

    blend.blendMode = 'hxx';
    blend.anchor.x = 0.5;
    blend.anchor.y = 0.5;
    blend.alpha = 0.3;
    blend.scale.x = 1;

    powerItem.powerup = powerup;
    powerItem.type = render;
    powerItem.blend = powerup;
    powerItem.scaleTo = 1;
    powerItem.position = 80 * column;
    powerItem.width = powerup.width;
    powerItem.height = powerup.height;

    //save powerup in array
    renderedPowerups.push(powerItem);

    //add blend effect
    powerup.addChild(blend);

    //render powerup
    container.addChildAt(powerup, 0);

    //in the main loop, add animation to the powerup
    //randomly change the size of nyan cat
    if (Math.abs(powerup.scaleTo - powerup.blend.scale.y) <= 0.01) {
        var random = Math.round(Math.random() * Math.random() * 100 + 80) / 100;
        powerup.scaleTo = random;
    }

    //change the size of light behind the cat
    if (powerup.scaleTo < powerup.blend.scale.x) {
        powerup.blend.scale.x -= 0.01;
        powerup.blend.scale.y -= 0.01;
    }

    if (powerup.scaleTo > powerup.blend.scale.x) {
        powerup.blend.scale.x += 0.01;
        powerup.blend.scale.y += 0.01;
    }

    //rotate it also a little
    if (powerup.powerup.rotation > 0.5) {
        powerup.rotateTo = -0.6;
    }
    if (powerup.powerup.rotation < -0.5) {
        powerup.rotateTo = 0.6;
    }

    if (powerup.rotateTo < 0) {
        powerup.powerup.rotation -= 0.02;

    } else {
        powerup.powerup.rotation += 0.02;

    }
{% endhighlight %}

When the user hits the Nyan catnip, he/she gets rainbow effect:

{% highlight js %}
//load rainbow image
var rainbow = new PIXI.Sprite(new PIXI.Texture.fromImage('/img/rainbow.png'));

rainbow.anchor.x = 0.5;
rainbow.anchor.y = 0.5;

//when the user hits Nyan powerup
//change speed
player.yspeed += 50;

//attach rainbow to the player
player.addChild(rainbow);

//when the powerup is over
if (player.yspeed < 50 && rainbow.parent) {

    //detach rainbow from the player
    rainbow.parent.removeChild(rainbow);
}
{% endhighlight %}

here will be animated gifs of nyan cat and rainbow effect

For the better understanding of PIXI classes and modules, have a look at [PIXI API documentation][pixidoc].

###Level rendering

Now lets focus on the most important part of the game: rendering tower and ledges. Each levels has to be generated randomly, but players which take part in a race in the same room, have to see exactly the same tower with identical arrangement of the ledges. That's why we implemented mechanism to randomly generate levels on the server-side. After generating it, each level is stored in separate room. The following code shows example generated level:

{% highlight js %}
generated level
{% endhighlight %}

Having this, we can render ledges on the client-side:

{% highlight js %}
//load 4 kind of ledges of 6 different colors
for (var i = 0; i < 6; i+=1) {
    textures[i] = {
        'left': new PIXI.Texture.fromImage('/img/' + i + '_ledge/left.png'),
        'right': new PIXI.Texture.fromImage('/img/' + i + '_ledge/right.png'),
        'middle': new PIXI.Texture.fromImage('/img/' + i + '_ledge/middle.png'),
        'alone': new PIXI.Texture.fromImage('/img/' + i + '_ledge/alone.png')
    };
}

//set vertical distance between ledges in the first 100 rows
var apart = 270; 

//get ledges array from the server
var ledgesLength = ledges.length;
for (i; i < ledgesLength; i += 1) {

    //set vertical distance between ledges in the second 100 rows
    if (i > 100) {
        apart = 320;
    }

    //set vertical distance between ledges in the third 100 rows
    if (i > 200) {
        apart = 340;
    }

    //compute vertical distance between ledges
    position = lastPosition - apart;
    lastPosition = position;
    j = 0;
    ledge = ledges[i];

    //iterate through every row 
    for (j; j < ledge.length; j += 1) {

        //ignore free spaces
        if (ledge[j]) {

            //choose appropriate ledge
            if (ledge[j] === 1) {
                ledge = new PIXI.Sprite(textures[Math.floor(i/50)].middle);
            } else if (ledge[j] === 2) {
                ledge = new PIXI.Sprite(textures[Math.floor(i/50)].left);
            } else if (ledge[j] === 3) {
                ledge = new PIXI.Sprite(textures[Math.floor(i/50)].right);
            } else {
                ledge = new PIXI.Sprite(textures[Math.floor(i/50)].foreveralone);
            }

            //set position
            ledge.position.x = 80 * column;
            ledge.position.y = position;

            ledge.anchor.x = 0.5;
            ledge.anchor.y = 0.5;

            //save ledge in an array
            renderedLedges.push(ledge);

            //render ledge
            container.addChildAt(ledge, 0);

            //find the last ledge, it will be used to detect if the game is finished
            if (i === ledgesLength - 1) {
                ledge.lastLevel = true;
            } else {
                ledge.lastLevel = false;
            }
        }
    }
}
{% endhighlight %}

Above code isn't effective. It computes and generates every type of ledges for each row (up to 300). After implementing this, the fps value slowed down rapidly. We came up with improved solution, to generate only fifty next and previous rows of the ledges:

{% highlight js %}
//in the main game loop, where collision with ledges is detected:
//if ledge is too far, remove it
if (ledge.parent && Math.abs(ledge.position.y - player.position.y) / 80 > 50) {
    ledge.parent.removeChild(ledge);
} else if (ledge.parent === undefined 
    && Math.abs(ledge.position.y - player.position.y) / 80 < 50) {
    container.addChildAt(ledge, 0);
}
{% endhighlight %}

The whole collision with ledges is detected as followed:

{% highlight js %}
collide = function (player) {
    if (player && player.position) {

        //iterate through each ledge
        for (var i = 0; i < ledges.length; i += 1) {
            var ledge = ledges[i];

            if (ledge) {

                //check the horizontal distance between ledge and player
                //remember that each cat is 30px wide
                var xdist = ledge.position.x - player.position.x + 30;

                //check if the horizontal distance is lower than the width of the ledge
                if (xdist - 60 > -ledge.width && xdist < ledge.width) {

                    //check the vertical distance between ledge and player
                    var ydist = ledge.position.y - player.position.y;

                    //check if the vertical distance is lower than the height of the ledge
                    //also make sure that the player is not in a move anymore
                    if (ydist > -ledge.height 
                        && ydist < ledge.height 
                        && player.yspeed < 0) {

                        //update new position value
                        player.position.y = ledge.position.y;

                        //the player is on ground now
                        player.onGround = true;

                        //jumps are allowed now
                        player.lockJump = 0;

                        //the vertical speed is 0
                        player.yspeed = 0;

                        //change animaiton to idle/waiting state
                        if (player.flying 
                            && !(player.keyPressed[39] || player.keyPressed[37] 
                                || player.keyPressed[38] || player.keyPressed[40] 
                                || player.keyPressed[32])) {
                            player.flying = false;
                            player.state.setAnimationByName('idle', true);
                        }
                    }
                }
            }
        }
    }
};
{% endhighlight %}

###Physics

The physics is very important yet rather easy part of the [Purrfect][purrfect] game. We wanted to accomplish someting similar to the Icy tower game, where you can bounce off the walls to get extra speed and jump higher. This is how we implemented it:

{% highlight js %}
//in the main game loop
animate = function () {

    requestAnimationFrame(animate);

    for (var player in players) {
        if (players.hasOwnProperty(player)) {

            if (players[player] === players[me]) {
                playa = players[me];

                //responding to keyboard
                //the left arrow key is pressed, so move the cat to the left
                if (playa.keyPressed[37]) {
                    playa.xspeed -= 0.6;
                }

                //the right arrow key is pressed, so move the cat to the right
                else if (playa.keyPressed[39]) {
                    playa.xspeed += 0.6;
                }              
                else {

                    //slow down a bit
                    if (playa.xspeed > 0) {
                        playa.xspeed -= 0.9;
                    } else if (playa.xspeed < 0) {
                        playa.xspeed += 0.9;
                    }

                    //stop the cat
                    if (Math.abs(playa.xspeed) < 1 && playa.xspeed !== 0) {
                        playa.xspeed = 0;
                    }
                }

                //speed limits
                if (playa.xspeed > 27) {
                    playa.xspeed = 27;
                }
                if (playa.xspeed < -27) {
                    playa.xspeed = -27;
                }

                //when the space bar is pressed
                if (!playa.lockJump && playa.keyPressed[32] 
                    || playa.position.y === 580 && playa.keyPressed[32]) {

                    //get the jump boost
                    jumpBoost = (playa.xspeed === 0 ? 1 : Math.abs(playa.xspeed / 20));
                    if (jumpBoost < 1) {
                        jumpBoost = 1;
                    }

                    //increase the vertical speed value
                    playa.yspeed += 6 * jumpBoost;
                }

                // responding to boundaries
                if (playa.position.x <= 40) {
                    playa.xspeed *= (-1);
                    playa.position.x = 41;
                }
                if (playa.position.x >= 750) {
                    playa.xspeed *= (-1);
                    playa.position.x = 749;
                }

                //move whole level to show 300px above the current player
                container.position.y = -players[player].position.y + 300;

                //slow down when hit the ground on the ledge
                if (playa.onGround) {
                    playa.yspeed = 0;
                }

                //update positions of the player
                playa.position.x += playa.xspeed;
                playa.position.y -= playa.yspeed;

                //detect collision with the ledges
                collide(players[player]);
            }
        }
    }
    renderer.render(stage);
};
{% endhighlight %}

I am aware that above examples may not be the easiest to understand. That's why I prepared more appealing examples:

here will be img tutor with jumps etc 

###Conclusion

[Node Knockout'13][nodenockout] was my first hackaton which I have ever participated. It was a hard but enjoyable weekend. I had real occasion to face my tiredness and it turned out, that despite small amount of sleep I was able to think logically without any major problems.

Together with my team, we had lots of fun during development. We wanted to create a multiplayer, playable game with memorable characters. Despite many problems and one major crisis, we've managed to accomplish more less what we've planned. 

The most important for me, is to learn new, fascinating technologies, which helps creating html5 games. Such events, are the best way to achieve that. I learned some basics about [Pixijs][pixijs] and [Spine][spine] and improve knowledge related to the [node.js][node.js] and [sockets][socket.io]. But most of all, I am glad that I spend fantastic time with people who share similar interests to mine and have the same urge to make games :). I am more than sure, that it wasn't my last hackaton, which I've participated.


[nodenockout]: http://nodeknockout.com/
[mchmurski]: https://twitter.com/mchmurski 
[Ania]: http://nodeknockout.com/people/526e56c214142e1075000067
[lukaszwojciak]: https://twitter.com/lukaszwojciak
[purrfect]: http://nodeknockout.com/teams/vanilla-eaters
[node.js]: http://nodejs.org/
[socket.io]: http://socket.io/
[express]: http://expressjs.com/
[lithium]: https://github.com/wojciak/lithiumJS
[pixijs]: http://www.pixijs.com/
[spine]: http://esotericsoftware.com/
[spinetutorials]: http://esotericsoftware.com/spine-videos/
[pixidoc]: http://www.goodboydigital.com/pixijs/docs/