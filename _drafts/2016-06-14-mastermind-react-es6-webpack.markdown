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

As mentioned before, in order to run ES6 smoothly, we need to use [Babel][babel] which will compile JavaScript ES6 syntax into ES5. We will also use [JSX][jsx] which is a JavaScript syntax extension, very similar to well known `XML`. Before starting coding, we need to setup the project and configure compilers. Let's use [Webpack][webpack] to build working JS files:

{% highlight js %}
//install webpack globally
npm i -g webpack
//install necessary modules locally
npm i --save-dev webpack@^1.0.0 babel-loader babel-preset-es2015 babel-preset-react path
{% endhighlight %}

The whole Webpack configuration is specified in the `webpack.config.js` file, which defines the inputs, the outputs of the project and types of transformations we want to perform. Some of the most important fragments are:

{% highlight js %}
module.exports = {
	entry: {
		game: './game.js' //which file should be loaded on the page
	},
	output: {
		path: path.resolve('./dist'), //where the compiled JavaScript file should be saved
		filename: './game.js', //name of the compiled JavaScript file
	},
	module: {
		loaders: [
			{
				test: /\.js?$/, //translate and compile on the fly ES6 with JSX into ES5
				exclude: /node_modules/,
				loader: 'babel',
				query: { //query configuration passed to the loader
					presets: ['react', 'es2015']
				}
			}
		]
	}
};
{% endhighlight %}

If you will now run the `npm run watch` specified in the `package.json` file:

{% highlight js %}
"scripts": {
    "watch": "webpack --progress --colors --watch --config ./webpack.config.js",
    "build": "webpack --config ./webpack.config.js"
}
{% endhighlight %}

You will be able to load your `file:///PATH_TO_FOLDER/dist/index.html` file in the browser.

As we specified in the configuration, our entry file is `./game.js`:

{% highlight js %}
import React from 'react';
import ReactDOM from 'react-dom';
import Mastermind from './src/mastermind';

ReactDOM.render( //initialise game with specified codeLength and Map of colors
	React.createElement(Mastermind, {codeLength: 4, colors: new Map([[0, 'zero'], [1, 'one'], [2, 'two'], [3, 'three'], [4, 'four'], [5, 'five']])}),
	document.getElementById('mastermind')
)
{% endhighlight %}

As you can see in the top of the file, there are imported three modules: `react`, `react-dom` which serves as the entry point of the DOM-related rendering paths and our Mastermind code.
After importing modules, the Mastermind code is initialised and rendered in `DOM` within the element which `ID` is `mastermind`, defined in the `./dist/index.html` file:

{% highlight js %}
<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<link rel="stylesheet" type="text/css" href="./styles.css">
	<title>Mastermind in React and ES6</title>
</head>
<body>
<div id="mastermind"></div>
<script src="game.js"></script>
</body>
</html>
{% endhighlight %}

In the `script` tag we include `game.js` file which should be in the same `dist` folder as `index.html`. If the Webpack's entry and output points are configured correctly, the `./dist/game.js` file should be compiled based on the aforementioned `./game.js`.

### Introduction to React components, lifecycle functions, props and states

Since we have the project setup

As I mentioned before, we will use `JSX` syntax extension. It is possible, to skip it and use plan JavaScript.

Because React has `unidirectional data flow`, the parent component should manage the state and pass it to the sub components (?) using `props` or `state`.

###Summary

Let's summarise what we've just learned.

[mastermind]: http://zofiakorcz.pl/mastermind
[ecmastript6]: http://www.ecma-international.org/ecma-262/6.0
[es6support]: https://kangax.github.io/compat-table/es6/
[babel]: https://babeljs.io/
[react]: https://facebook.github.io/react/
[jsx]: https://facebook.github.io/react/docs/jsx-in-depth.html
[webpack]: http://webpack.github.io/docs/what-is-webpack.html
