---
layout: post
title: "Purrfect - a Node Knockout'13 multiplayer game"
date:   2013-11-15 14:08:00
---
![Purrfect game]({{ site.url }}/assets/duckhunt.jpg)

[Node Knockout][nodenockout] is one of the most popular 48h, online hackaton featuring `node.js`. Together with my friends: [@mchmurski][mchmurski], [Ania][Ania] and [@lukaszwojciak][lukaszwojciak] we wanted to make a multiplayer, enjoyable game with a catchy idea - popular meme cats as a main characters! 

<!--more-->

The main purpose of the [Purrfect][purrfect] game is to jump as fast as you can to reach the highest (300th) level before other players do - for a cat's glory!. To run faster and jump higher, you can bounce off the walls or look for Nyan catnips powerup. After consuming a catnip, your cat is blessed by Nyan cat's rainbow power, and in conclusion it gets extra power to reach very high areas.

The [Purrfect][purrfect] is a multiplayer game and it was written in both server-side ([node.js][node.js], [socket.io][socket.io], [express][express]) and client-side ([lithiumJS][lithium], [pixijs][pixijs], [spine][spine]) technologies. In this article I will walk you through some of the most fundamental ones but I want to focus only on client-side part of the implementation.



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