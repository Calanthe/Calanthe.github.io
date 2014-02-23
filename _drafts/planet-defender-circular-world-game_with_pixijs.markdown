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
The main theme of this year's jam, was '_We don't see things as they are, we see them as we are_'. We found it out few hours after we already started implementing our ideas, so the better solution was, to focus on delivering what we have already started.

My team (me & [@lukaszwojciak][wojciak]) decided to learn something new and related to circle geometry, so we got an idea, to implement game called [Planet Defender][jam_defender], which is somehow similar to the classic [Space Invaders][spaceinvaders], but with a planet behind the main character, so he/she can protect it.
We had some problems with defining the main character, but at the end we came to conclusion, that the easiest to implement and animate will be a simple pyramid, which will imitate the egyptian God Ra.

Similar to [Purrfect][purrfect_article], we used [Spine][spine] and [Pixi.js][pixi] to animate and render graphic assets. In this article I would like to focus mainly on circle geometry and all of the mathematics which is necessary to understand the rotation of the planet and collision between the planet and meteors.

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

//render sprite and add it to the camera container at a specific index
camera.addChildAt(sprite, 0);
{% endhighlight %}

The planet is attached to the camera, so its position relates to that aforementioned container.
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

placeholder for the imgtutor with rotation of the planet - note the camera on the pictures, maybe move it further and include meteors also?

###The movement of meteors and collision with the planet

At the beginning of the game, we create only one meteor (enemy) which will start its movement from the position directly above the player.

{% highlight js %}
//Create a Spine animation
var spine = new PIXI.Spine('rock/skeleton.json');

//position related to the camera container
spine.position.x = 0;
spine.position.y = 0;
spine.rotation = 0;
//this will be needed to calculate the pivot value
spine.radius = 400;

//pivot will be needed to detect the collision with the planet
//this is a distance from the center of the planet
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
spine.rotation = Math.random() * ((Math.PI / 16) * multiplier)
                                 - ((Math.PI / 16) * multiplier / 2);
{% endhighlight %}

When the player rotates the planet, all of the existing meteors have to update their positions.

{% highlight js %}
//meteor is an enemy here
enemy.position.y += enemy.velocity * Math.cos(enemy.rotation);
enemy.position.x -= enemy.velocity * Math.sin(enemy.rotation);
//update the velocity so each meteor goes faster when it is nearer to the player
enemy.velocity *= 1.008 - (0.003 * enemy.rotation) / Math.PI;
{% endhighlight %}

As you can see, there is no big magic here. We just used commonly known trigonometric functions of the equations of the circle.
When the planet will rotate, all of the meteors will change their positions accordingly to the rotation of the planet.
Theirs velocity also changes a little, so they goes faster when they are closer to the player.

Now let's focus on detecting collisions between the planet and meteors. To calculate it we will use a [Pythagorean theorem][pyttheorem].
This theorem will help us calculate the needed distance between the meteor and the center of the planet.

{% highlight js %}
var enemyDistanceFromCenter = this.pivot.y - Math.sqrt(this.position.y * this.position.y
                                             + this.position.x * this.position.x);
if (enemyDistanceFromCenter < radius + 30) {
    //collision detected
}
{% endhighlight %}

placeholder for img tutor with two situations

As you can see (something diffrent?), in the situation, when the meteor is straight above the player, collision detection is very easy. All we need to do is calculate a difference between a starting point and an actual position of the meteor.
Calculated distance just need to be compared with the planet's radius, which need to be extended by the radius of single meteor.
The only impediment in situation where there is rotation added, is that to calculate distance, we need to help yourself with the mentioned [Pythagorean theorem][pyttheorem].

###Bullets and collision with meteors

To create a bullet we will use almost the same technique as with the meteors. The only difference is that weapons will be fired always in the same position and its initial rotation will depend on the camera's rotation.
Meteor's position was related to the camera, bullets have to follow that camera and change theirs rotation in the opposite direction to that container.

{% highlight js %}
//when the user press space bar
var texture = PIXI.Texture.fromImage('bullet.png'),
    sprite = new PIXI.Sprite(texture);

//position related to the camera container
sprite.position.x = 0;
sprite.position.y = 0;

//anchor will be needed to calculate the axis of rotation
sprite.anchor.x = 0.5;
sprite.anchor.y = 0.5;

//radius will be very important to detect the collision
sprite.radius = 400;

//each bullet has to follow the camera and rotate in direction completely opposite
sprite.rotation = -camera.rotation;
sprite.pivot.y = sprite.radius + 80;

//render sprite and add it to the camera container at a specific index
camera.addChildAt(sprite, 2);
{% endhighlight %}

When we rotate the planet, positions of the bullets will be also changed:

{% highlight js %}
bullet.position.y -= velocity * Math.cos(bullet.rotation);
bullet.position.x += velocity * Math.sin(bullet.rotation);
{% endhighlight %}

Calculating collision between the weapons and meteors is rather similar to the previous example.

{% highlight js %}
var bulletDistance = Math.abs(Math.sqrt(bullet.position.y * bullet.position.y
                                        + bullet.position.x * bullet.position.x)),
    enemyDistanceFromCenter = enemy.pivot.y - Math.sqrt(enemy.position.y
                        * enemy.position.y + enemy.position.x * enemy.position.x),
    bulletDistanceFromCenter = bulletDistance + planet.radius + bullet.height;

if (bulletDistanceFromCenter - enemyDistanceFromCenter < 0) {
    //collision detected
}
{% endhighlight %}

placeholder for the static image or img tutor with long distance and collision?

We used [Pythagorean theorem][pyttheorem] once again to calculate the positions of the bullet and meteor. When we know those values, checking the distance between those two object is just a matter of a proper subtraction.

###Conclusion

Learning and coding [Planet Defender][jam_defender] game was a real fun! We managed to calculate and detect all of the necessary values without any game framework and physics engine.
It looked little scary at the beginning, but with little math and ubiquitously known theorems, it wasn't that difficult.

It was really enjoyable and profitable weekend. This was my second hackathon in which I participated but this time, I spent much more time on sleeping and I don't regret that ;). Tiredness can heavily slow down our thinking process. It is very important to, especially during the events like this, spend some time on mental regeneration.

Among eleven completed games, there were only two made in html5 and JavaScript. The [Planet Defender][jam_defender] won second prize and I happily returned to home with my new `Angry Birds` mascot :). The only think I regret form that weekend, is that I missed a visitation of a local TV station. What I've seen during [the repetition?][tv], contestants had some real fun during that time ;).

If you are interested into our messy code, [here is the github repo][repo]. Feel free to comment or contribute our work. Any helpful action will be appreciated.

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
[pyttheorem]: http://en.wikipedia.org/wiki/Pythagorean_theorem
[jam_defender]: http://wojciak.com.pl/jam_defender
[tv]: https://www.youtube.com/watch?v=xnDwChRYB6Q
[repo]: https://github.com/wojciak/jam_defender