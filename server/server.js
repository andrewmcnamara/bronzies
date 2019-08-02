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
			server.get( '/api/highscore', App.highscore.get ); //highscore routes
			server.post( '/api/highscore', App.highscore.post );

			server.get('/api/questions', App.questions.get); //question routes

			App.debugging( 'Routes established', 'report' );


			//server
			server.listen(5555, function() {

				console.log("\n\n");

				CFONTS.say('Bronzies', {
					colors: ['red', 'yellow'],
					letterSpacing: 0,
					align: 'center',
					space: false,
				});

				CFONTS.say( server.name + ' listening at ' + server.url, {
					font: 'console',
					colors: ['white'],
					letterSpacing: 0,
					align: 'center',
				});

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


/***************************************************************************************************************************************************************
 *
 *  HIGHSCORE
 *
 * Getting latest and saving new highscores
 *
 **************************************************************************************************************************************************************/


(function(App) {

	var module = {};

	var sanitizer = require('sanitizer');
	var highscoreDB = App.db.collection('highscore');


	//------------------------------------------------------------------------------------------------------------------------------------------------------------
	// private function: format highscore
	//
	// res  resource  Restify resource object
	// ID   string    ID to be highlighted
	//------------------------------------------------------------------------------------------------------------------------------------------------------------
	function formatHighscore( res, ID ) {
		App.debugging( 'Running formatHighscore' + ( ID ? ' with ' + ID : '' ), 'report' );

		highscoreDB.find().limit( 50 ).sort( { score: -1 }, function(error, docs) {
			if( error || !docs ) {
				App.debugging( 'Highscore DB find error with: ' + error, 'error' );

				res.send({"code": "InternalError", "message": "Highscore DB find error with: " + error }); //output json
			}
			else {
				App.debugging( 'Got highscore from DB', 'report' );

				// var highscore = docs;

				// if( ID.length ) {
				// 	for(var i = highscore.length - 1; i >= 0; i--) {

				// 		if( ID === highscore[i]._id.toString() ) {
				// 			highscore[i].justadded = true;
				// 			break;
				// 		}

				// 	};
				// }

				const highscore = [
					{"_id":"5c655cbf69bbd1069ee19147","name":"Celeste Hayman BSBLSC","nays":2,"score":1500,"date":"2019-02-14T12:18:58.246Z--2019-02-14T12:19:11.798Z"},
					{"_id":"5c5ad56469bbd1069ee19144","name":"Alkimos SLSC","nays":36,"score":1000,"date":"2019-02-06T12:38:40.484Z--2019-02-06T12:39:00.396Z"},
					{"_id":"59bb9da06cb3360787f64d43","name":"Bilgola Richard","nays":23,"score":750,"date":"2017-09-15T09:29:15.002Z--2017-09-15T09:30:08.108Z"},
					{"_id":"5bdf9cde16bebc08a929bd47","name":"James PMSLSC","nays":12,"score":601,"date":"2018-11-05T01:28:32.971Z--2018-11-05T01:29:02.365Z"},
					{"_id":"583b8e57c2e365064191b599","name":"Reef Raff: Avani ","nays":9,"score":500,"date":"2016-11-28T01:54:19.885Z--2016-11-28T01:54:36.665Z"},
					{"_id":"59e480d02a037e07c891df73","name":"Eva Simpson AVALON","nays":43,"score":353,"date":"2017-10-16T09:50:06.797Z--2017-10-16T09:50:08.164Z"},
					{"_id":"5bfccc7416bebc08a929bd51","name":"#coogeealltheway","nays":22,"score":340,"date":"2018-11-27T04:46:29.980Z--2018-11-27T04:47:48.970Z"},
					{"_id":"5aa79f48b0f51307e281c815","name":"Samson","nays":2,"score":301,"date":"2018-03-13T09:51:57.323Z--2018-03-13T09:52:09.090Z"},
					{"_id":"5bfcc3b716bebc08a929bd50","name":"THICCshake","nays":16,"score":270,"date":"2018-11-27T04:09:51.601Z--2018-11-27T04:10:31.835Z"},
					{"_id":"5b9cb023c5bae607ba90098a","name":"Ben","nays":6,"score":257,"date":"2018-09-15T07:09:11.192Z--2018-09-15T07:09:22.937Z"},
					{"_id":"583d5cb5c2e365064191b5a0","name":"Reef Raff: Britt","nays":3,"score":250,"date":"2016-11-29T10:46:50.426Z--2016-11-29T10:47:17.324Z"},
					{"_id":"5a7ad7b07933b407dafe5e37","name":"Kahoot","nays":0,"score":250,"date":"2018-02-07T10:40:14.890Z--2018-02-07T10:40:47.805Z"},
					{"_id":"583ab152c2e365064191b592","name":"Reef Raff: Abby ","nays":0,"score":222,"date":"2016-11-27T10:11:04.544Z--2016-11-27T10:11:30.217Z"},
					{"_id":"5c9a968569bbd1069ee1914b","name":"HAINJE","nays":7,"score":222,"date":"2019-03-26T21:15:21.240Z--2019-03-26T21:15:49.248Z"},
					{"_id":"5a7587197933b407dafe5e35","name":"Viv","nays":12,"score":216,"date":"2018-02-03T09:54:15.768Z--2018-02-03T09:55:37.204Z"},
					{"_id":"5bcda96c16bebc08a929bd41","name":"Gav","nays":4,"score":210,"date":"2018-10-22T10:41:31.307Z--2018-10-22T10:41:48.036Z"},
					{"_id":"5be93a5616bebc08a929bd49","name":"Beau","nays":6,"score":207,"date":"2018-11-12T08:30:25.692Z--2018-11-12T08:31:18.956Z"},
					{"_id":"59eeadae2a037e07c891df74","name":"Max B","nays":8,"score":204,"date":"2017-10-24T03:03:43.204Z--2017-10-24T03:04:14.009Z"},
					{"_id":"5811a09fb4fe170516aa558e","name":"Yasssss!!!","nays":29,"score":200,"date":"2016-10-27T06:36:22.085Z--2016-10-27T06:37:19.101Z"},
					{"_id":"583cf008c2e365064191b59e","name":"Reef Raff: Sarah","nays":0,"score":200,"date":"2016-11-29T03:03:05.624Z--2016-11-29T03:03:36.420Z"},
					{"_id":"59e0a20e2a037e07c891df71","name":"Hoo","nays":28,"score":173,"date":"2017-10-13T11:22:35.919Z--2017-10-13T11:22:53.932Z"},
					{"_id":"5bec015516bebc08a929bd4d","name":"suisted","nays":11,"score":165,"date":"2018-11-14T11:04:48.936Z--2018-11-14T11:04:54.705Z"},
					{"_id":"5a78f2397933b407dafe5e36","name":"Kieo","nays":2,"score":160,"date":"2018-02-06T00:08:59.771Z--2018-02-06T00:09:29.471Z"},
					{"_id":"5bcecc0e16bebc08a929bd42","name":"Icebreaker 18","nays":7,"score":160,"date":"2018-10-23T07:21:02.824Z--2018-10-23T07:21:50.096Z"},
					{"_id":"5a7bd0797933b407dafe5e38","name":"Mason","nays":8,"score":155,"date":"2018-02-08T04:22:14.847Z--2018-02-08T04:22:17.255Z"},
					{"_id":"579587ba4a6c0920359fc66e","name":"Josie","nays":0,"score":153,"date":"0"},
					{"_id":"583b9230c2e365064191b59a","name":"Reef Raff: Jannicke","nays":6,"score":150,"date":"2016-11-28T02:10:38.078Z--2016-11-28T02:10:55.711Z"},
					{"_id":"58775ee42eeef2084c54150f","name":"Belinda","nays":8,"score":146,"date":"2017-01-12T10:47:18.953Z--2017-01-12T10:48:03.743Z"},
					{"_id":"5c4ac610696827096cb98a90","name":"Max ","nays":14,"score":141,"date":"2019-01-25T08:16:42.591Z--2019-01-25T08:17:19.696Z"},
					{"_id":"583abcc6c2e365064191b595","name":"Reef Raff Lisa","nays":1,"score":134,"date":"2016-11-27T10:59:09.141Z--2016-11-27T11:00:22.505Z"},
					{"_id":"5a0528162a037e07c891df7a","name":"Lisa ","nays":30,"score":132,"date":"2017-11-10T04:14:57.516Z--2017-11-10T04:16:21.590Z"},
					{"_id":"580c2c042776d50521a68555","name":"Ivancho","nays":25,"score":130,"date":"2016-10-23T03:17:39.455Z--2016-10-23T03:18:15.375Z--2016-10-23T03:18:22.391Z"},
					{"_id":"579587ba4a6c0920359fc66f","name":"Dom","nays":0,"score":125,"date":"0"},
					{"_id":"583ddc8ac2e365064191b5a1","name":"Reef Raff: Olivia ","nays":9,"score":125,"date":"2016-11-29T19:52:26.731Z--2016-11-29T19:52:42.722Z"},
					{"_id":"5c8994e569bbd1069ee19149","name":"Hugh Bronte","nays":7,"score":125,"date":"2019-03-13T23:39:06.105Z--2019-03-13T23:40:21.847Z"},
					{"_id":"584bfa0ac2e365064191b5a9","name":"Reef Raff: Nicholas","nays":1,"score":120,"date":"2016-12-10T12:49:39.887Z--2016-12-10T12:50:15.771Z"},
					{"_id":"5bea6f9d16bebc08a929bd4a","name":"Fraser","nays":44,"score":120,"date":"2018-11-13T06:30:00.570Z--2018-11-13T06:30:53.357Z"},
					{"_id":"5a00fd492a037e07c891df78","name":"Doylie","nays":15,"score":119,"date":"2017-11-07T00:23:45.947Z--2017-11-07T00:24:38.942Z"},
					{"_id":"583d4a3ec2e365064191b59f","name":"Reef Raff: Kate M","nays":3,"score":113,"date":"2016-11-29T09:27:45.811Z--2016-11-29T09:28:29.900Z"},
					{"_id":"579587ba4a6c0920359fc670","name":"Dom","nays":2,"score":112,"date":"0"},
					{"_id":"5c9aa8bf69bbd1069ee1914c","name":"Grunstein","nays":0,"score":112,"date":"2019-03-26T22:33:26.441Z--2019-03-26T22:33:35.714Z"},
					{"_id":"579587ba4a6c0920359fc671","name":"Iron Mike","nays":0,"score":110,"date":"0"},
					{"_id":"583bf8ebc2e365064191b59d","name":"#REEFRAFF:ALEX","nays":3,"score":110,"date":"2016-11-28T09:28:54.175Z--2016-11-28T09:29:14.394Z"},
					{"_id":"583bb4fdc2e365064191b59b","name":"Reef Raff: Nicola","nays":1,"score":109,"date":"2016-11-28T04:38:50.191Z--2016-11-28T04:39:25.231Z"},
					{"_id":"583ab1b8c2e365064191b594","name":"Reef Raff: Dom","nays":1,"score":107,"date":"2016-11-27T10:13:05.237Z--2016-11-27T10:13:12.789Z"},
					{"_id":"583ab1abc2e365064191b593","name":"Reef Raff Mikala ","nays":1,"score":105,"date":"2016-11-27T10:12:29.132Z--2016-11-27T10:12:56.536Z"},
					{"_id":"583de144c2e365064191b5a2","name":"Reef Raff: Joe","nays":5,"score":105,"date":"2016-11-29T20:12:20.168Z--2016-11-29T20:12:52.508Z"},
					{"_id":"5bd443ea16bebc08a929bd45","name":"#coogeebetterthanbondi","nays":50,"score":105,"date":"2018-10-27T10:54:20.447Z--2018-10-27T10:54:34.106Z"},
					{"_id":"5a1b844e2a037e07c891df7b","name":"Ads","nays":7,"score":104,"date":"2017-11-27T03:18:50.820Z--2017-11-27T03:19:41.181Z"},
					{"_id":"5c63f34f69bbd1069ee19146","name":"Adi","nays":12,"score":104,"date":"2019-02-13T10:36:32.165Z--2019-02-13T10:37:03.825Z"}
				];

				res.send(highscore); //output json
			}
		});

	}


	//------------------------------------------------------------------------------------------------------------------------------------------------------------
	// Get current highscore
	//
	// req   object  Restify req object
	// res   object  Restify res object
	// next  object  Restify next object
	//------------------------------------------------------------------------------------------------------------------------------------------------------------
	module.get = function( req, res, next ) {
		App.debugging( 'Highscore requested', 'interaction' );

		formatHighscore( res, '' );
	};


	//------------------------------------------------------------------------------------------------------------------------------------------------------------
	// Save current highscore
	//
	// req   object  Restify req object
	// res   object  Restify res object
	// next  object  Restify next object
	//------------------------------------------------------------------------------------------------------------------------------------------------------------
	module.post = function( req, res, next ) {
		App.debugging( 'Highscore posted', 'interaction' );

		var data = req.params; //user data
		var newEntry = {};

		//sanitize user data
		newEntry.name = sanitizer.escape( data.name );
		newEntry.nays = parseInt( sanitizer.escape( data.nays ) );
		newEntry.score = parseInt( sanitizer.escape( data.score ) );
		newEntry.date = sanitizer.escape( data.date );


		//double post protection
		highscoreDB.find({
			name: newEntry.name,
			nays: newEntry.nays,
			score: newEntry.score,
			date: newEntry.date,
		}, {}, function(error, docs) {
			if( error ) {
				App.debugging( 'Highscore DB find error with: ' + error, 'error' );
			}
			else if( docs.length ) {
				App.debugging( 'Highscore post already exists', 'error' );
				console.info(docs.length);

				formatHighscore( res, '' );
			}
			else {

				//insert to DB
				highscoreDB.insert(newEntry, function(error, thisInsert) {
					if( error || !thisInsert ) {
						App.debugging( 'Highscore DB insert error with: ' + error, 'error' );

						res.send({"code": "InternalError", "message": "Highscore DB insert error with: " + error }); //output json
					}
					else {
						App.debugging( 'Inserted highscore to DB', 'report' );

						var ID = thisInsert._id; //last insert ID

						formatHighscore( res, ID.toString() );
					}
				});

			}
		});
	};


	App.highscore = module;

}(App));

/***************************************************************************************************************************************************************
 *
 *  QUESTIONS
 *
 * Get all Questions
 *
 **************************************************************************************************************************************************************/


(function(App) {

	var module = {};

	var questionsDB = App.db.collection('questions');


	//------------------------------------------------------------------------------------------------------------------------------------------------------------
	// Get questions
	//
	// req   object  Restify req object
	// res   object  Restify res object
	// next  object  Restify next object
	//------------------------------------------------------------------------------------------------------------------------------------------------------------
	module.get = function( req, res, next ) {
		App.debugging( 'Questions requested', 'interaction' );

		questionsDB.find({}, function(error, docs) {
			if( error || !docs ) {
				App.debugging( 'Questions DB find error with: ' + error, 'error' );
			}
			else {
				App.debugging( 'Got questions from DB', 'report' );

				// var questions = docs;
				const questions = [{
					"id": "579587de4a6c0920359fc689",
					"image": "signal1",
					"alt": "",
					"text": "To attract attention between a boat and the shore",
				},
				{
					"id": "579587de4a6c0920359fc68a",
					"image": "signal2",
					"alt": "",
					"text": "Return to shore",
				},
				{
					"id": "579587de4a6c0920359fc68b",
					"image": "signal3",
					"alt": "",
					"text": "Remain stationary",
				},
				// {
				// 	"id": "579587de4a6c0920359fc68c",
				// 	"image": "signal4",
				// 	"alt": "",
				// 	"text": "Message not clear, repeat",
				// },
				// {
				// 	"id": "579587de4a6c0920359fc68d",
				// 	"image": "signal5",
				// 	"alt": "",
				// 	"text": "Pick up swimmers",
				// },
				// {
				// 	"id": "579587de4a6c0920359fc68e",
				// 	"image": "signal6",
				// 	"alt": "",
				// 	"text": "Investigate submerged object",
				// },
				// {
				// 	"id": "579587de4a6c0920359fc68f",
				// 	"image": "signal7",
				// 	"alt": "",
				// 	"text": "Proceed further out to sea",
				// },
				// {
				// 	"id": "579587de4a6c0920359fc690",
				// 	"image": "signal8",
				// 	"alt": "",
				// 	"text": "Go to the left or the right",
				// },
				// {
				// 	"id": "579587de4a6c0920359fc691",
				// 	"image": "signal9",
				// 	"alt": "",
				// 	"text": "Message understood, all clear",
				// },
				// {
				// 	"id": "579587de4a6c0920359fc692",
				// 	"image": "signal10",
				// 	"alt": "",
				// 	"text": "Pick up or adjust buoys",
				// },
				// {
				// 	"id": "579587de4a6c0920359fc693",
				// 	"image": "signal11",
				// 	"alt": "",
				// 	"text": "Assistance required",
				// },
				// {
				// 	"id": "579587de4a6c0920359fc694",
				// 	"image": "signal12",
				// 	"alt": "",
				// 	"text": "Boat wishes to return to shore",
				// },
				// {
				// 	"id": "579587de4a6c0920359fc695",
				// 	"image": "signal13",
				// 	"alt": "",
				// 	"text": "Emergency evacuation alarm (Water to beach)",
				// },
				// {
				// 	"id": "579587de4a6c0920359fc696",
				// 	"image": "signal14",
				// 	"alt": "",
				// 	"text": "Shore signal received and understood",
				// },
				// {
				// 	"id": "579587de4a6c0920359fc697",
				// 	"image": "signal15",
				// 	"alt": "",
				// 	"text": "Search completed",
				// },
				// {
				// 	"id": "579587de4a6c0920359fc698",
				// 	"image": "signal16",
				// 	"alt": "",
				// 	"text": "Emergency evacuation flag",
				// },
				// {
				// 	"id": "579587de4a6c0920359fc699",
				// 	"image": "signal17",
				// 	"alt": "",
				// 	"text": "Emergency evacuation alarm",
				// },
				// {
				// 	"id": "579587de4a6c0920359fc69a",
				// 	"image": "signal18",
				// 	"alt": "",
				// 	"text": "Mass rescue",
				// },
				// {
				// 	"id": "579587de4a6c0920359fc69b",
				// 	"image": "signal19",
				// 	"alt": "",
				// 	"text": "Helicopter signal—request to enter",
				// },
				// {
				// 	"id": "579587de4a6c0920359fc69c",
				// 	"image": "signal20",
				// 	"alt": "",
				// 	"text": "Signal Flag",
				// },
				// {
				// 	"id": "579587de4a6c0920359fc69d",
				// 	"image": "signal21",
				// 	"alt": "",
				// 	"text": "Submerged Patient Missing",
				// },
				{
					"id": "579587de4a6c0920359fc69e",
					"image": "signal22",
					"alt": "",
					"text": "All Clear/OK",
				}];

				res.send(questions); //output json
			}
		});
	};


	App.questions = module;

}(App));


/***************************************************************************************************************************************************************
 *
 *  Start App
 *
 **************************************************************************************************************************************************************/


App.init(); //start app
