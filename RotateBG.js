/*******************************************************************************
 * RotateBG.js
 * -Preloads an array of full-page background images
 * -Cross fades background images at given interval
 * -Optionally create a full page loading div that covers page until the first image is loaded
 * 
 * Usage:
 * $.RotateBG( options )
 * options.Backgrounds: Array of full page background images.
 * options.Interval: Number of seconds for each image to show
 * options.LoadingImg: An image to show on the loading div
 * options.LoadingBGColor: The background color
 * options.onLoaded: a function to execute when the first image is loaded
 * options.Shuffle: shuffle background images
 * options.FadeSpeed: the speed of the fade. default = 0.1 = 10fps
 * 
 * Rob Parham
 * WTF License 2.0
 ******************************************************************************/
;
(function($) {
	$.RotateBG = function(options) {

		if ('undefined' === typeof options.Backgrounds) alert("Please provide backgrounds array.");

		var Backgrounds = options.Backgrounds;
		var Interval = 'undefined' === typeof options.Interval ? 8 : options.Interval;
		var LoadingImg = 'undefined' === typeof options.LoadingImg ? null : options.LoadingImg;
		var LoadingBGColor = 'undefined' === typeof options.LoadingBGColor ? "#000" : options.LoadingBGColor;
		var onLoaded = 'function' === typeof options.onLoaded ? options.onLoaded : function() {};
		var shuffle = 'undefined' === typeof options.Shuffle ? false : options.Shuffle;
		var FadeSpeed = 'undefined' === typeof options.FadeSpeed ? 0.1 : options.FadeSpeed;

		var onloadExecuted = false;
		var onFirstLoaded = function() {
			if (onloadExecuted) return;
			onLoaded();
			onloadExecuted = true;
		};

		var arrayShuffle = function(array) {
			var currentIndex = array.length,
				temporaryValue, randomIndex;
			while (0 !== currentIndex) {
				randomIndex = Math.floor(Math.random() * currentIndex);
				currentIndex -= 1;
				temporaryValue = array[currentIndex];
				array[currentIndex] = array[randomIndex];
				array[randomIndex] = temporaryValue;
			}
			return array;
		};

		if (shuffle) Backgrounds = arrayShuffle(Backgrounds);

		// Some vars
		var properties = ["margin", "padding", "width", "height", "border"],
			styles = [],
			b = "body",
			divid = "Loader" + (Math.floor(Math.random() * 9999999999999) + 1),
			originalStyles = true,
			styleid_before = "Style" + (Math.floor(Math.random() * 9999999999999) + 1);
		styleid_after = "Style" + (Math.floor(Math.random() * 9999999999999) + 1),
			objs = [];

		for (var i = 0; i < Backgrounds.length; i++)
			objs.push({
				url: Backgrounds[i],
				loaded: false
			});

		// If the LoadImg is set, draw the loading div
		if (LoadingImg !== null) {

			// Get original body styles
			for (var i = properties.length; i--;) {
				var value = 'undefined' !== typeof $(b).css(properties[i]) ?
					$(b).css(properties[i]) : "initial";
				styles.push({
					name: properties[i],
					value: value
				});
			}

			// Clean up the body for a full page div
			$(b).css("margin", "0")
				.css("padding", "0")
				.css("width", "100%")
				.css("height", "100%")
				.css("border", "0");

			originalStyles = false;

			// Add the loading div
			$("<div />").attr("id", divid).prependTo(b);
			$("#" + divid)
				.css("background-color", LoadingBGColor)
				.css("margin", "0")
				.css("width", "100vw")
				.css("height", "100vh")
				.css("position", "fixed")
				.css("z-index", "999999999999999999999999")
				.css("background-image", "url('" + LoadingImg + "')")
				.css("background-attachment", "fixed")
				.css("background-repeat", "no-repeat")
				.css("background-position", "center")
				.css("top", "0")
				.css("left", "0");
		}

		// Get background styles
		var getStyles = function(sudoSelector, opacity, bgImage) {
			var css = "body:" + sudoSelector + "{content:' ';display:block;position:fixed;" +
				"left:0;top:0;width:100vw;height:100vh;z-index:-1;opacity:" + opacity + ";background-image: " +
				"url('" + bgImage + "');background-repeat:no-repeat;background-position:50% 0;" +
				"-ms-background-size:cover;-o-background-size:cover;-moz-background-size:cover;" +
				"-webkit-background-size:cover;background-size:cover;}";
			return css;
		};

		// Cross fades current BG Image with the next one
		var crossFadeBgImages = function(opacity, rotate, objs, index) {
			setTimeout(function() {
				opacity = opacity - FadeSpeed;
				if (opacity <= 0) {
					rotate(++index, objs);
				} else {
					if ('undefined' === typeof objs[index]) index = 0;
					var nextIndex = 'undefined' === typeof objs[index + 1] ? 0 : index + 1;
					$("#" + styleid_before).remove();
					$("head").prepend("<style id='" + styleid_before + "'>" + getStyles("before", "1", objs[nextIndex]['url']) + "</style>");
					$("#" + styleid_after).remove();
					$("head").prepend("<style id='" + styleid_after + "'>" + getStyles("after", opacity, objs[index]['url']) + "</style>");
					crossFadeBgImages(opacity, rotate, objs, index);
				}
			}, 50);
		};

		// wait for the next rotation
		var waitForNext = function(rotate, objs, index, seconds) {
			if ('undefined' === typeof seconds) var seconds = 0;
			var timer = setInterval(function() {
				seconds++;
				if (seconds >= Interval) {
					// crossfade the background
					clearInterval(timer);
					crossFadeBgImages(1, rotate, objs, index);
				}
			}, 1000);
		};

		(function rotate(index, objs) {

			// Reset the rotation if at the end of the array
			if ('undefined' === typeof Backgrounds[index]) return rotate(0, objs);

			// If it's not loaded yet, load it
			if (!objs[index]['loaded']) {
				// Pre-start the timer
				var seconds = 0;
				var timer = setInterval(
					function() {
						seconds++;
					},
					'undefined' === typeof Interval ? 8 : Interval
				);

				//load image
				var Img = new Image();
				Img.src = objs[index]['url'];
				Img.onerror = function() {
					alert(objs[index]['url'] + " is not a valid image URL.");
				};
				Img.onload = function() {

					// set the initial bg image
					$("#" + styleid_before).remove();
					$("body").prepend("<style id='" + styleid_before + "'>" + getStyles("before", "1", objs[index]['url']) + "</style>");
					// If the styles were changed...
					if (!originalStyles) {
						// reset styles
						for (var i = styles.length; i--;) $(b).css(styles[i]['name'], styles[i]['value']);

						// Fade the loading div out
						(function fadeDivOut(opacity) {
							setTimeout(function() {
								opacity = opacity - FadeSpeed;
								if (opacity <= 0) {
									$("#" + divid).remove();
									originalStyles = true;
									onFirstLoaded();
								} else {
									$("#" + divid).css("opacity", opacity);
									fadeDivOut(opacity);
								}
							}, 50);
						})(1);
					} else onFirstLoaded();

					// load the next one in advance
					if ('undefined' != typeof objs[index + 1] && !objs[index + 1]['loaded']) {
						var preloaded_img = new Image();
						preloaded_img.src = objs[index + 1]['url'];
					}

					clearInterval(timer);
					waitForNext(rotate, objs, index, seconds);
				};
			} else waitForNext(rotate, objs, index);
		})(0, objs);
	};
})(jQuery);
