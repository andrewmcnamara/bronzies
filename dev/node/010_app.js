/***************************************************************************************************************************************************************
 *
 *  RESTful API
 *
 * Initiate restify server and setting up routes
 *
 **************************************************************************************************************************************************************/

'use strict';


var App = (function() {

	var mongojs = require('mongojs'); //DB a la Mongo
	var chalk = require('chalk'); //making it pretty

	var restify = require('restify'); //restify ftw
	var CFONTS = require('cfonts'); //colors!!
	var server = restify.createServer({ name: 'Bronzies-RESTful-App' }); //start server


	return {
		//----------------------------------------------------------------------------------------------------------------------------------------------------------
		// settings
		//----------------------------------------------------------------------------------------------------------------------------------------------------------
		debug: true, //debugging infos
		db: mongojs( 'mongodb://127.0.0.1:27017/bronzies', ['highscore', 'questions'] ), //mongo DB connection


		//----------------------------------------------------------------------------------------------------------------------------------------------------------
		// Initiate server
		//----------------------------------------------------------------------------------------------------------------------------------------------------------
		init: function() {

			//plugins
			server
				.use(restify.fullResponse())
				.use(restify.bodyParser()); //plugins

			App.debugging( 'Restify plugins installed', 'report' );


			//routes
			server.get( '/highscore', App.highscore.get ); //highscore routes
			server.post( '/highscore', App.highscore.post );

			server.get('/questions', App.questions.get); //question routes

			App.debugging( 'Routes established', 'report' );


			//server
			server.listen(5555, function() {

				console.log("\n\n");

				var fonts = new CFONTS({
					'text': '  Bronzies',
					'colors': ['red', 'yellow'],
					'letterSpacing': 0,
					'space': false
				});

				console.log( "\n" + '      ' + chalk.white.bgBlue.bold('    ' + server.name + ' listening at ' + server.url + '     ') + "\n\n" );

				App.debugging( 'Server started', 'report' );
			});
		},


		//----------------------------------------------------------------------------------------------------------------------------------------------------------
		// debugging prettiness
		//
		// text  string   Text to be printed to debugger
		// code  keyword  What kind of urgency: report,error,interaction
		//----------------------------------------------------------------------------------------------------------------------------------------------------------
		debugging: function( text, code ) {

			if( code === 'report' ) {
				if( App.debug ) console.log( chalk.green('\u2713 ') + text );
			}

			else if( code === 'error' ) {
				if( App.debug ) console.log( chalk.red('\u2717 ') + text );
			}

			else if( code === 'interaction' ) {
				if( App.debug ) console.log( chalk.blue('\u261C ') + text );
			}

		}

	};

})();