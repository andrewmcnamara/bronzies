/***************************************************************************************************************************************************************
 *
 * Scaffolding HTML
 *
 **************************************************************************************************************************************************************/


(function(App) {

	var module = {};

	//------------------------------------------------------------------------------------------------------------------------------------------------------------
	// loading screen
	//------------------------------------------------------------------------------------------------------------------------------------------------------------
	module.loading = function() {
		App.debugging('Scaffolding loading screen', 'report');

		$('.js-loading').remove(); //remove all previously opened loading screens

		var HTML = '<div class="js-loading loading">' +
			'	<div class="loading-wrapper">' +
			'		<h1 class="js-loading-animation loading-animation">Loading</h1>' +
			'	</div>' +
			'</div>';

		$('.js-body').prepend(HTML);
	};


	//------------------------------------------------------------------------------------------------------------------------------------------------------------
	// playground with everything we need for the game
	//------------------------------------------------------------------------------------------------------------------------------------------------------------
	module.playground = function() {
		App.debugging('Scaffolding playground', 'report');

		if( !$('.js-playground').length ) {
			var HTML = '' +
				'<div class="js-splash splash is-animating">' +
				'	<div class="splash-wrapper">' +
				'		<img class="splash-logo" src="img/slsa-logo.png" alt="SLSA logo">' +
				'	</div>' +
				'</div>' +
				'<header class="header-wrapper js-header">' +
				'	<button class="js-switchview switch">' +
				'		<span class="switch-toggle">Switch view</span>' +
				'	</button>' +
				'	<img class="logo-img" itemscope itemtype="http://schema.org/Organization" src="img/slsa-logo.png" alt="SLSA Logo">' +
				'	<button class="js-highscore highscore-link">' +
				'		<svg aria-labelledby="title" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"' +
				'			 width="50px" height="50px" viewBox="-404 213.6 50 50" style="enable-background:new -404 213.6 50 50;" xml:space="preserve">' +
				'			<title id="title" lang="en">Highscore</title>' +
				'			<path fill="#b3b3b3" d="M-355.3,239.7l1.3-1.1l-1.3-1.1l1-1.3l-1.5-0.9l0.7-1.5l-1.6-0.5l0.3-1.7l-1.7-0.2v-1.7l-1.7,0.2l-0.3-1.7' +
				'				l-1.6,0.5l-0.7-1.5l-1.5,0.9l-1-1.4l-1.3,1.1l-1.3-1.1l-1,1.4l-1.5-0.9l-0.7,1.5l-1.6-0.5l-0.3,1.7l-1.7-0.1v1.7l-1.7,0.2l0.3,1.7' +
				'				l-1.6,0.5l0.7,1.5l-1.5,0.9l1,1.3l-1.3,1.1l1.3,1.1l-1,1.3l1.5,0.9l-0.7,1.5l1.6,0.5l-0.3,1.7l1.7,0.2v1.7l1.7-0.2l0.3,1.7l1.6-0.5' +
				'				l0.7,1.5l1.5-0.9l1,1.4l1.3-1.1l1.3,1.1l1-1.4l1.5,0.9l0.7-1.5l1.6,0.5l0.3-1.7l1.7,0.2v-1.7l1.7-0.2l-0.3-1.7l1.6-0.5l-0.7-1.5' +
				'				l1.5-0.9L-355.3,239.7z M-362.3,239.2l-0.7,0.5l0.3,0.9l1.4,4.7l-4-2.8l-0.7-0.5l-0.7,0.5l-4,2.8l1.4-4.7l0.3-0.9l-0.7-0.5' +
				'				l-3.9-2.9l4.9-0.1h0.9l0.3-0.8l1.6-4.6l1.6,4.6l0.3,0.8h0.9l4.9,0.1L-362.3,239.2z"/>' +
				'		</svg>' +
				'	</button>' +
				'	<div class="progress-wrapper">' +
				'		<span class="progress-title">Progress</span>' +
				'		<ul class="js-progress progress"></ul>' +
				'		<div class="score">' +
				'			<span class="js-score score-count">0</span>' +
				'			<div class="score-yaynays">' +
				'				<span class="js-scoreyay score-yay">0</span>' +
				'				<span class="js-scorenay score-nay">0</span>' +
				'			</div>' +
				'		</div>' +
				'	</div>' +
				'</header>' +
				'<main class="playground js-main">' +
				'	<div class="js-question question"></div>' +
				'	<ul class="js-answers answers"></ul>' +
				'</main>';

			$('.js-body').append(HTML);
		}
	};


	//------------------------------------------------------------------------------------------------------------------------------------------------------------
	// highscore screen
	//------------------------------------------------------------------------------------------------------------------------------------------------------------
	module.highscore = function() {
		App.debugging('Scaffolding highscore', 'report');

		var HTML = '<div class="js-popup popup highscore-wrapper" data-id="highscore">' +
			'	<div class="js-popup-screen popup-screen"></div>' +
			'	<div class="js-popup-content popup-content highscore" id="test">' +
			'		<button class="js-popup-close popup-close" data-id="highscore">close</button>' +
			'		<h1 class="highscore-headline">Highscore</h1>' +
			'		<h4 class="highscore-mine">' +
			'			Your score:' +
			'			<span class="js-score highscore-score">0</span>' +
			'			<span class="js-scorenay highscore-nays">0</span>' +
			'		</h4>' +
			'		<p class="js-highscore-blob highscore-blob"></p>' +
			'		<ul class="js-highscore-wrongs highscore-wrongs"></ul>' +
			'		<form class="js-form form" method="POST" action="' + App.HIGHSCOREPOST + '">' +
			'			<label for="name" class="form-label">Enter yourself into the Highscore</label>' +
			'			<input id="name" type="text" name="name" class="js-form-name form-name" placeholder="Your name">' +
			'			<span class="js-form-error"></span>' +
			'			<input class="js-form-nays" type="hidden" name="nays" value="0">' +
			'			<input class="js-form-score" type="hidden" name="score" value="0">' +
			'			<input class="js-form-date" type="hidden" name="date" value="' + new Date().toJSON() + '">' +
			'			<input type="submit" class="is-hidden" value="submit">' +
			'		</form>' +
			'		<ol class="js-highscores highscores"></ol>' +
			'	</div>' +
			'</div>';

		$('.js-body').append(HTML);
	};


	// //------------------------------------------------------------------------------------------------------------------------------------------------------------
	// // about screen
	// //------------------------------------------------------------------------------------------------------------------------------------------------------------
	// module.about = function() {
	// 	App.debugging('Scaffolding about', 'report');

	// 	var HTML = '<div class="js-popup popup about-wrapper" data-id="about">' +
	// 		'	<div class="js-popup-screen popup-screen"></div>' +
	// 		'	<div class="js-popup-content popup-content about">' +
	// 		'		<button class="js-popup-close popup-close" data-id="about">close</button>' +
	// 		'		<h1 class="about-headline">About</h1>' +
	// 		'		<p class="about-blob">' +
	// 		'			This app has been developed by <a href="http://dominik-wilkowski.com" target="_blank">Dominik Wilkowski</a>' +
	// 		'			and designed my <a href="http://conley.com.au/">Dylan Conley</a>.' +
	// 		'		</p>' +
	// 		'		<p class="about-blob">' +
	// 		'			Let me know if you <a href="https://github.com/dominikwilkowski/bronzies/issues" target="_blank">have any issues</a>.' +
	// 		'		</p>' +
	// 		'	</div>' +
	// 		'</div>';

	// 	$('.js-body').append(HTML);
	// };


	App.scaffold = module;

}(App));