---
layout: post
title: "Mastermind game in React and ECMAScript 6"
date:   2016-06-14 16:38:00
image: <img src='/assets/mastermind.png' alt='Mastermind game in React and ES6'>
---
<div class='image right'>
<img src='/assets/mastermind.png' alt='Mastermind game in React and ES6'>
<span class="caption">Mastermind game in React and ES6</span>
</div>
The best way to learn new technologies is to make something interesting, fun, engaging and unconventional. In this tutorial I will walk you through a [Mastermind game][mastermind] I've build to show some of the most fundamental ideas behind React library, the newest ECMAScript 6 specification and Webpack module bundler.

<!--more-->

The [ECMAScript 6][ecmastript6] is the newest, published in June 2015, edition of the ECMAScript Language Specification, which standardized JavaScript scripting programming language. The ES6 introduces a new syntax and features which we will take a closer look at later in this article. It's worth to mention that not all of the [browsers support][es6support] those fancy features (other word?) so it's important to use a special compiler like [Babel][babel] to make sure that our code written in ES6 will run correctly also on older browsers.

[React][react] is a library made by Facebook which uses a concept of `Virtual DOM`, which allows to apply as few mutations as possible. When the element's state changes, React decides whether an actual DOM update is necessary by comparing changes in his `Virtual DOM` with an actual DOM.
The React's philosophy leans also to clean separation between components. One of this library's feature is a `one-way data flow` also called `unidirectional data flow` which means that child components cannot directly affect parent components, which should manage the state and pass it down the chain using `props` or `state`.

### Setup and initialization
<div class='image left'>
<img src='/assets/sliding_puzzle/folder.png' alt='Folder structure'>
<span class="caption">Folder structure of example Phaser project</span>
</div>
Because of the nature of JavaScript and browser security features, we have to run the server to load resources required by the game. There are a [few ways][servers] to do that but my favourite is using the [Grunt][grunt] task runner with the [Yeoman][yeoman] scaffolding tool.
I found a nice [Yeoman generator for Phaser][yeogen] and updated it with the newest `Phaser` version and amended the `gruntfile`. You can check out and use my current (still working in progress) setup in [Github][github]. If it's easier for you, you can also take a look at the source code of the working [sliding puzzle game][sliding-puzzle].

Once we have everything set up and ready, let's dive into the initialization of the `Phaser` framework. Our main folder consists only of the `index.html` file and `js`, `css` and `assets` folders.

{% highlight js %}

var game = new Phaser.Game(800, 600, Phaser.CANVAS,
'slidingpuzzle', { preload: preload, create: create });

{% endhighlight %}

The above line demonstrates how to initialize the `Phaser` instance, by setting a proper width and height, the method of rendering (it can be also `Phaser.AUTO` to detect WebGL with a fallback to canvas), the aforementioned id of the parent element and the list of used states in the game.

### Game loop

We have two states in the game: `preload` and `create`. They will be fired in the same order as they are specified. The `Phaser` allows you to use more than those two, e.g. `boot` to show a loader but in this game we will use only two basic states.

In the `preload` state we will only load the image which will be our background in the game:

###Conclusion

That's it! You've created a very easy puzzle game in `Phaser` using many of the built-in capabilities of the framework. If you want to explore further you could try implementing scores, an option to change the background image or functionality to share your best score on facebook.


[mastermind]: http://zofiakorcz.pl/mastermind
[ecmastript6]: http://www.ecma-international.org/ecma-262/6.0
[es6support]: https://kangax.github.io/compat-table/es6/
[babel]: https://babeljs.io/
[react]: https://facebook.github.io/react/
