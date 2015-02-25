/***************************************************************************************************************************************************************
 *
 * Highscore
 *
 **************************************************************************************************************************************************************/


(function(App) {

	var module = {};

	//------------------------------------------------------------------------------------------------------------------------------------------------------------
	// get highscore from REST API
	//
	// callback  function  Callback function
	//------------------------------------------------------------------------------------------------------------------------------------------------------------
	module.get = function( callback ) {
		App.debugging('Getting highscore', 'report');

		App.debugging('Shooting off Ajax', 'report'); //we shoot it off right away here

		App.loading.start( true );

		$.ajax({
			url: App.HIGHSCOREGET,
			dataType: 'json',
			timeout: App.TIMEOUT,
			success: function( data ) {
				App.debugging('Highscore recived', 'report');

				store.set('highscore', data); //save in localStorage

				if(callback instanceof Function) {
					callback();
				}

				App.loading.start( false );
			},
			error: function(jqXHR, status, errorThrown) {
				App.debugging('Highscore get json errored out with: ' + status, 'error');

				App.highscore.get( callback ); //just simply try again
			}
		});

	};


	//------------------------------------------------------------------------------------------------------------------------------------------------------------
	// initiate highscore
	//------------------------------------------------------------------------------------------------------------------------------------------------------------
	module.init = function() {
		App.debugging('Initiating highscore', 'report');

		App.scaffold.highscore();
		App.scaffold.about();
		App.progress.draw();


		//click menu button
		$('.js-body').on('click', '.js-menubutton', function() {
			App.debugging('Menu button clicked', 'interaction');

			$('.js-menu').toggleClass('is-invisible');
		});


		//click highscore button
		$('.js-body').on('click', '.js-highscore', function() {
			App.debugging('Highscore button clicked', 'interaction');

			App.popup.open( 'highscore', true );

			App.highscore.get(function() {
				App.highscore.draw();
			});
		});


		//click about button
		$('.js-body').on('click', '.js-about', function() {
			App.debugging('About button clicked', 'interaction');

			App.popup.open( 'about', true );
		});


		//submit new highscore
		$('.js-body').on('submit', '.js-form', function(e) {
			App.debugging('Saving Score', 'interaction');

			e.preventDefault();

			App.highscore.post( $(this).serialize(), function() {
				App.debugging('Score saved, emptying score', 'report');

				App.highscore.draw();

				//clear score
				App.CORRECT = 0;
				App.PICK = 0;
				App.PICKTEXT = '';
				App.YAYS = 0;
				App.NAYS = 0;
				App.WRONGS = {};

				//update score in header
				$('.js-scoreyay').text('0');
				$('.js-scorenay').text('0');
				$('.js-score').text('0');

				//update score in form
				$('.js-form-nays').val('0');
				$('.js-form-score').val('0');

				App.questions.get( false, function() {
					App.progress.draw();
					App.questions.draw();
				});

				App.progress.draw();
			});
		});

	};


	//------------------------------------------------------------------------------------------------------------------------------------------------------------
	// draw highscore
	//------------------------------------------------------------------------------------------------------------------------------------------------------------
	module.draw = function() {
		App.debugging('Dawing highscore', 'report');

		var HIGHSCORE = store.get('highscore');
		var highscoreHTML = '';

		$('.js-form-date').val( new Date().toJSON() ); //update time

		//render highscore rows
		$.each(HIGHSCORE, function( index, score ) {
			highscoreHTML += '<li class="js-highscores-item highscores-item' + ( score.justadded ? ' is-active' : '' ) + '">' +
				'	<span class="highscore-name">' + score.name + '</span>' +
				'	<span class="highscore-score">' + score.score + '</span>' +
				'	<span class="highscore-nays">' + score.nays + '</span>' +
				'</li>';
		});

		//building highscore blob
		var tuples = [];
		var HTML = '';
		var i = 0;

		var pushups = Math.ceil( (10 * App.NAYS) * (App.NAYS / ( App.YAYS > 0 ? App.YAYS : 1 )) ); //push ups calculation

		if( !isNaN(pushups) && pushups > 0 ) {
			HTML += '<p><em class="highscore-blob-pushups">' +
				'	According to your score you should be doing ' + pushups + ' push ups!' +
				'</em></p>';
			}


		if( App.NAYS > 0 ) { //only show if we actually have some wrongs
			HTML += '<h5 class="highscore-blob-headline">Questions you got wrong most frequently</h5>';
		}

		HTML += '<ul class="highscore-blob-wrongs">';

		for(var key in App.WRONGS) { //we have to create an array from the object we populate
			tuples.push([key, App.WRONGS[key]]);
		}

		tuples.sort(function(a, b) { //then we sort it by one of it's value
			return a[1] < b[1] ? 1 : a[1] > b[1] ? -1 : 0
		});

		for(var i = 0; i < tuples.length; i++) { //build the HTML
			HTML += '	<li>' + tuples[i][0] + ' (' + tuples[i][1] + ' nays)</li>';

			if( i >= 4 ) { //show a max of 5
				break;
			}
		};

		HTML += '</ul>'


		$('.js-highscore-blob').html( HTML );
		$('.js-highscores').html( highscoreHTML );


		//scroll to just submitted highscore
		if( $('.js-highscores-item.is-active').length ) {
			App.debugging('Scroll to score', 'report');

			var topPos = parseInt( $('.js-highscores-item.is-active').offset().top ) + parseInt( $('.js-popup-content').scrollTop() ) - 22;

			console.log(topPos);

			$('.js-popup-content').animate({ scrollTop: topPos }, 400);
		}
	};


	//------------------------------------------------------------------------------------------------------------------------------------------------------------
	// add to highscore
	//
	// win  boolen  Correct answer?
	//------------------------------------------------------------------------------------------------------------------------------------------------------------
	module.update = function( win ) {
		App.debugging('Updating highscore', 'report');

		var score = App.YAYS - App.NAYS; //simple enough, try to cheat THAT!

		//update score in header
		$('.js-scoreyay').text( App.YAYS );
		$('.js-scorenay').text( App.NAYS );
		$('.js-score').text( score );

		//update score in form
		$('.js-form-nays').val( App.NAYS );
		$('.js-form-score').val( score );

		App.progress.update( win );
	};


	//------------------------------------------------------------------------------------------------------------------------------------------------------------
	// post new highscore
	//
	// submitData  string    Serialize form data
	// callback    function  Callback function
	//------------------------------------------------------------------------------------------------------------------------------------------------------------
	module.post = function( submitData, callback ) {
		App.debugging('Posting highscore', 'report');

		var _hasName = $('.js-form-name').val() != '';
		submitData += '--' + new Date().toJSON(); //add end date

		if( _hasName ) {
			App.debugging('Shooting off Ajax', 'report');

			$('.js-form-error').html(''); //clear errors
			App.loading.start( true );

			$.ajax({
				url: App.HIGHSCOREPOST,
				dataType: 'json',
				type: 'POST',
				data: submitData,
				timeout: App.TIMEOUT,
				success: function( data ) {
					App.debugging('Highscore recived', 'report');

					store.set('highscore', data); //save to localStorage

					$('.js-form-name').val(''); //go again if you want... double post protection?

					if(callback instanceof Function) {
						callback();
					}

					App.loading.start( false );
				},
				error: function(jqXHR, status, errorThrown) {
					App.debugging('Highscore post json errored out with: ' + status, 'error');

					App.highscore.post( submitData, callback ); //try again... pretty please?
				}
			});
		}
		//you gotta provide a name for the highscore, anything...
		else {
			App.debugging('No username given', 'error');

			var HTML = '<p class="form-error">Can\'t add you to the highscore without a name...</p>';

			$('.js-form-error').html( HTML );
		}

	};


	App.highscore = module;

}(App));