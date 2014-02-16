---
layout: post
title: "Planet Defender - a circular world game with Pixi.js"
date:   2014-02-01 15:56:06
---
![Planet Defender](./assets/planet_defender/planet_defender.jpg)

The third weekend of January was the coldest in Poland (so far!) time of passing winter. Temperature in Poznań hit -11°C during the day. In such conditions, the best way to spend free time
is to stay at home and enjoy the advantages of comfortable and warm bed ;). But this weekend was special for the game makers from all over the world. The [Global Game Jam][ggj] was taking place and I couldn't miss that!

<!--more-->

[Poznań Global Game Jam][pggj] edition took place in [Politechnika Poznańska][pp]. Over forty enthusiastic people participated in this event to within 48 hours make glorious games.
The main theme of this year's jam, was 'We don't see things as they are, we see them as we are'. Because of the differences in time zones, organizers announced it few hours after we already started implementing our ideas.
The prototype version of our game was almost working at that time, so the better solution was, to focus on delivering what we have already started.

My team (me & [@lukaszwojciak][wojciak]) decided to learn something new and related to circle geometry, so we got an idea, to implement game similar to the classic [Space Invaders][spaceinvaders], but with a planet behind the main character, so he/she can protect it.
We had some problems with defining the main character, but at the end we came to conclusion, that the easiest to implement and animate will be a simple pyramid, which will imitate the egyptian God Ra.

Similar to [Purrfect][purrfect_article], we used [Spine][spine] and [Pixi.js][pixi] to animate and render graphic assets. In his article I would like to focus mainly on circle geometry and all of the mathematics which is necessary to understand the rotation of the planet and collision between the planet and meteors.

###Rotation of the planet

Lets start with revision of standard equations of the circle. Let me help myself with a nice and clear explanation form the [Wikipedia][wiki]. In an [Cortesian coordinate system][cortesian] circle is a set of all points (x,y) such that
{% highlight js %}
(x-a)<sup>2</sup> + (y-b)<sup>2</sup> = r<sup>2</sup>
{% endhighlight %}
where (a,b) are the center coordinates and r is a radius.

The same equation can be written using the trigonometric functions as:
{% highlight js %}
x = a + r cos t,
y = b + r sin t
{% endhighlight %}
where t is a variable in the range 0 to 2π, interpreted geometrically as the angle that the ray from (a, b) to (x, y) makes with the x-axis.

here will be images with circle

Knowing this, we can now move to the aspect of rendering and rotating our planet. Similar to the [Purrfect game][purrfect_article], we used [Pixi.js][pixi] to help us render assets on `canvas` element.
First we need to create a container, which will represent a collection of displayed objects. [Pixi.js][pixi] implemented a helpful object called [DisplayObjectContainer()][pixicontainer], which allows us to simply add, remove and manage other objects which it contains.

{% highlight js %}
camera = new PIXI.DisplayObjectContainer();
//place x position in the center of x axis
camera.position.x = window.innerWidth / 2;
//place the camera little lower on the y axis so we can see only top of the planet
camera.position.y = window.innerHeight + 250;
//at the beginning camera is not moving
camera.velocity = 0;
{% endhighlight %}

After creating container, we set its x and y coordinates to fit the position of our planet.
Speaking of the planet, we can easily render it as followed:

{% highlight js %}
var texture = PIXI.Texture.fromImage('planet.jpg'),
    sprite = new PIXI.Sprite(texture);

//position related to the camera container
sprite.position.x = 0;
sprite.position.y = 0;

//anchor will be needed to calculate the axis of rotation
sprite.anchor.x = 0.5;
sprite.anchor.y = 0.5;

//radius will be very important to detect the collision
sprite.radius = 400;

//render sprite and add it to the camera container
camera.addChildAt(sprite, 0);
{% endhighlight %}

Now we want to add a rotation of the planet in such a way, that its direction will dependent on the player's action.

{% highlight js %}
window.addEventListener('keydown', function (e) {
    var key = e.keyCode;

    if (key === 37) {
        camera.velocity = 0.02;
        player.walkLeft();
    }

    if (key === 39) {
        camera.velocity = -0.02;
        player.walkRight();
    }
}

//in a game loop
camera.rotation += camera.velocity;
{% endhighlight %}

After detecting which key has been pressed, the velocity of the camera is being updated. In a main game loop, rotation of the camera will be changed accordingly to the new velocity.
For the sake of simplicity, I don't want to describe in details how the player object works. In general it's just a [Spine][spine] object, with `walkLeft`, `walkRight`, `idle` and `fire` animation states.

placeholder for the imgtutor with rotation of the planet - note the camera on the pictures

###The movement of the meteors and collision with the planet

At the beginning of the game, we create only one meteor (enemy) which will starts its movement from the position somewhere above the player.

{% highlight js %}
//Create a Spine animation
var spine = new PIXI.Spine('rock/skeleton.json');

//position related to the camera container
spine.position.x = 0;
spine.position.y = 0;
spine.rotation = 0;
spine.radius = 400;

//pivot will be needed to detect the collision with the planet
spine.pivot.y = spine.radius + window.innerHeight / 2 + Math.random() * 400;

//render sprite and add it to the camera container
camera.addChild(spine);

//multiplier value will be needed to calculate next meteor's rotation
var multiplier = 1;
{% endhighlight %}

After destroying the first meteor, few more are being created but with little different pivot and rotation values.

{% highlight js %}
//after destroying a meteor
multiplier += 0.1;

//each of the incoming meteor will have different pivot and rotation values
spine.pivot.y = spine.radius + window.innerHeight / 2 + Math.random() * 400;
spine.rotation = Math.random() * ((Math.PI / 16) * multiplier) - ((Math.PI / 16) * multiplier / 2);
{% endhighlight %}

When the player rotates the planet, all of the existing meteors have to update their positions.

{% highlight js %}
//meteor is an enemy here
enemy.position.y += enemy.velocity * Math.cos(enemy.rotation);
enemy.position.x -= enemy.velocity * Math.sin(enemy.rotation);
enemy.velocity *= 1.008 - (0.003 * enemy.rotation) / Math.PI;
{% endhighlight %}

As you can see, there is no big magic here. We just used commonly known trigonometric functions of the equations of the circle.
When the planet will rotate, all of the meteors will change their positions accordingly to the rotation of the planet.

Now let's focus on detecting collisions between the planet and meteors.

###Conclusion

[ggj]: http://globalgamejam.org/
[pggj]: http://globalgamejam.org/2014/jam-sites/poznan-game-jam?destination=node/348
[pp]: http://www.put.poznan.pl/
[wojciak]: https://twitter.com/lukaszwojciak
[purrfect_article]: http://zofiakorcz.pl/purrfect-game/
[spine]: http://esotericsoftware.com
[pixi]: http://www.pixijs.com/
[cortesian]: http://en.wikipedia.org/wiki/Cartesian_coordinate_system
[wiki]: http://en.wikipedia.org/wiki/Circle
[spaceinvaders]: https://www.youtube.com/watch?v=QObneYZIdKI
[pixicontainer]: http://www.goodboydigital.com/pixijs/docs/classes/DisplayObjectContainer.html