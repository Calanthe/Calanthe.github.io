---
layout: post
title: "Purrfect - a Node Knockout'13 multiplayer game"
date:   2013-11-15 14:08:00
---
![Purrfect game]({{ site.url }}/assets/duckhunt.jpg)

[Node Knockout][nodenockout] is one of the most popular 48h, online hackaton featuring `node.js`. Together with my friends: [@mchmurski][mchmurski], [Ania][Ania] and [@lukaszwojciak][lukaszwojciak] we wanted to make a multiplayer, enjoyable game with a catchy idea - popular cat memes as a main characters! 

<!--more-->

The main purpose of the [Purrfect][purrfect] game is to jump as fast as you can to reach the highest (300th) level before other players do - for the cat's glory!. To run faster and jump higher, you can bounce off the walls or look for Nyan catnips powerup. After consuming a catnip, your cat is blessed by Nyan cat's rainbow power, and in conclusion it gets extra skill to reach very high areas.

The [Purrfect][purrfect] is a multiplayer game and it was written in both server-side ([node.js][node.js], [Socket.IO][socket.io], [express][express]) and client-side ([lithiumJS][lithium], [pixijs][pixijs], [Spine][spine]) technologies. In this article I will walk you through some of the most fundamental ones but I want to focus only on the client-side part of the implementation.

###Animations with Spine

The [Spine][spine] is an application which allows to easily create 2D skeletal animation for games. You have to prepare proper graphic assets by yourself - the whole character and separately all of the important parts of its body. Having this, you can prepare all character's animations used in the game. When finished, prepared animation can be exported in JSON or binary file and used easily in the further development. [This list of video tutorials][spinetutorials] should be very helpful if you want to understand this topic better.

As I mentioned before, we wanted to use famous cats to be our characters, which take part in a race. After choosing the most characteristic memes, the following assets have been prepared:

here will be img tutor? list of meme, big cat and avatar

Because of the limited, 48h time of the competition, we managed to animate only chemical cat. On the following pictures, you can see examples of waiting and running animations used in the game:

here will be 2 animated cats - with captions?

###Pixi.js and level rendering

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