/***************************************************************************************************************************************************************
 *
 * Animations
 *
 **************************************************************************************************************************************************************/


(function(App) {

	var module = {};

	//------------------------------------------------------------------------------------------------------------------------------------------------------------
	// play animation
	//------------------------------------------------------------------------------------------------------------------------------------------------------------
	module.play = function() {
		App.debugging( 'Animations: play animation', 'report' );

		var animations = ['flags', 'shark', 'ball', 'tube'];
		var animation = Math.floor( Math.random() * animations.length );
		var className = 'has-animated-' + animations[ animation ];

		$('.js-animation').addClass( className );

		var transitionEvent = App.whichTransitionEvent();

		setTimeout(function timeoutRemoveClass() {
			$('.js-animation').removeClass( className );
		}, 50000);

		App.animations.set(); //start next animation
	};


	//------------------------------------------------------------------------------------------------------------------------------------------------------------
	// Set new animation
	//------------------------------------------------------------------------------------------------------------------------------------------------------------
	module.set = function() {
		App.debugging( 'Animations: set new animation', 'report' );

		var min = 50000;
		var max = 100000;
		var timeout = Math.floor( Math.random() * (max - min) + min );

		setTimeout(function timeoutPlay() {
			App.animations.play();
		}, timeout);
	};


	//------------------------------------------------------------------------------------------------------------------------------------------------------------
	// initiate popups
	//------------------------------------------------------------------------------------------------------------------------------------------------------------
	module.init = function() {
		App.debugging( 'Animations: Initiating', 'report' );

		App.scaffold.animations();

		App.animations.set();
	};


	App.animations = module;

}(App));