<!DOCTYPE html>
<html>
    <head>
		<title>RotateBG Example</title>
        <style>
            body{padding:1em 5em 0 5em, background-color:grey;}
			div{font-family: monospace; display: inline-block; padding:2em; margin:1em; border-radius:3em; border: 2px dotted black; background: rgba(255, 255, 255, 0.7);}
        </style>
    </head>
    <body>
		<div>
			<h1>RotateBG Plugin</h1>
			<p>A jQuery plugin that pre-loads and rotates background images</p>
		</div>
        
		<!-- scripts -->
		<script src="//code.jquery.com/jquery-1.11.3.min.js"></script>
        <script src="./RotateBG.js"></script>
        <script>
			$(document).ready(function () {

				$.RotateBG({
					Backgrounds: [
						"./bg_samples/trees.jpg",
						"./bg_samples/hefalump.jpg",
						"./bg_samples/city.jpg"
					],
					Interval: 8,
					LoadingImg: "./bg_samples/loading.gif",
					LoadingBGColor: "#2A2826",
					onLoaded: function () {
						console.log("loaded");
					},
					Shuffle: true
				});

			});
        </script>
    </body>
</html>
