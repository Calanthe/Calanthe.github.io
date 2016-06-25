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
The React's philosophy leans also to clean separation between components. One of this library's feature is a `one-way data flow` which means that child components cannot directly affect parent components.

### Setup and initialization
<div class='image left'>
<img src='/assets/sliding_puzzle/folder.png' alt='Folder structure'>
<span class="caption">Folder structure of example Phaser project</span>
</div>

In order to run ES6 smoothly, we need to use [Babel][babel] which will compile JavaScript ES6 syntax into ES5 which is understandable also by older browsers. We will also use [JSX][jsx] which is a JavaScript syntax extension, very similar to well known `XML`.

After init

As I mentioned before, we will use `JSX` - syntax similar to XML. Example with one and without + link to tutorial

{% highlight js %}

var game = new Phaser.Game(800, 600, Phaser.CANVAS,
'slidingpuzzle', { preload: preload, create: create });

{% endhighlight %}

Because React has `unidirectional data flow`, the parent component should manage the state and pass it to the sub components (?) using `props` or `state`.

### Game loop

We have two states in the game: `preload` and `create`. They will be fired in the same order as they are specified. The `Phaser` allows you to use more than those two, e.g. `boot` to show a loader but in this game we will use only two basic states.

In the `preload` state we will only load the image which will be our background in the game:

###Summary

Let's summarise what we've just learned.

[mastermind]: http://zofiakorcz.pl/mastermind
[ecmastript6]: http://www.ecma-international.org/ecma-262/6.0
[es6support]: https://kangax.github.io/compat-table/es6/
[babel]: https://babeljs.io/
[react]: https://facebook.github.io/react/
[babel]: https://babeljs.io/
[jsx]: https://facebook.github.io/react/docs/jsx-in-depth.html
