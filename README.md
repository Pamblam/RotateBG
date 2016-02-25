# RotateBG
Rotate and cross fade background images with this simple jQuery plugin.

*   [Details Here](http://blog.geneticcoder.com/2015/12/09/rotate-and-cross-fade-background-images-with-jquery-css-background-opacity-trick/)
*   [Live Demo Here](http://www.geneticcoder.com)

**By:** Robert Parham | 
**License:** wtfpl.net WTFPL | 
**Version:** 1

Basic Usage:

	$.RotateBG({
		// An array of background images to rotate through
		Backgrounds:['img1.png', 'img2.png', 'img3.png'],

		// How many seconds to pause between rotations [Optional]
		Interval: 8,

		// An image that will be displayed while the first image is preoading [Optional]
		LoadingImg: "./img/loader.gif",
	
		// if LoadingImg is set, this will be the background color behind the image [Optional]
		LoadingBGColor: "#2A2826",
	
		// Shuffle the Backgrounds array? [Optional]
		Shuffle: true,

		// A function to be executed when the first image is done loading [Optional]
		onLoaded: function(){ console.log("First image has loaded."); },

		// The speed of the crossfade. A number less than one. [Optional]
		FadeSpeed: 0.1
	});
