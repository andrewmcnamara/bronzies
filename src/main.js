/** @jsx jsx */
import Body from './body';
import { useQuestions } from './app';
import { jsx } from '@emotion/core';
import { useState } from 'react';

/**
 * Simple Fisher–Yates shuffle function https://en.wikipedia.org/wiki/Fisher%E2%80%93Yates_shuffle
 *
 * @param  {array} array - An array to be shuffled
 *
 * @return {array}       - The shuffled array
 */
export function shuffle( array ) {
	const newArray = [ ...array ]; // cloning so we don't manipulate the input data
	let index = newArray.length;

	while( index ) {
		const randIndex = Math.floor( Math.random() * index-- );
		const value = newArray[ index ];

		newArray[ index ] = newArray[ randIndex ];
		newArray[ randIndex ] = value;
	}

	return newArray;
}

/**
 * A pure function (for testing) to pick a subset of random items from an array including a previously picked one
 *
 * @param  {object}   current     - The item that must be included
 * @param  {array}    deck        - An array of items
 * @param  {function} shuffleDeck - A shuffle function, default: shuffle
 * @param  {Integer}  limit       - The limit of items to be returned, default: 4
 *
 * @return {array}                - A subset of the input array, shuffled and including the `current` item
 */
export function getNewAnswers( current, deck, shuffleDeck = shuffle, limit = 4 ) {
	let newCards = [
		...shuffleDeck(
			deck.filter( question => question.image !== current.image )
		).slice( 0, limit ),
		current,
	];
	return shuffleDeck( newCards );
}

/**
 * Given an array of objects, add a string to the `tagName` key of the item with the matching `image` key but only if it hasn't been set
 *
 * @param  {array}  answers - An array of objects in the shape [{ image: 'String1' },{ image: 'String2' }]
 * @param  {string} image   - A string that should match one of the items in the array
 * @param  {string} tagName - The name of the tag key
 * @param  {string} tag     - The tag to be added
 *
 * @return {array}          - The original array but with a new `tagName` key [{ image: 'String1' },{ image: 'String2', status: 'String' }]
 */
export function tagAnswer( answers, image, tagName, tag ) {
	return [ ...answers ].map( answer => {
		if( answer.image === image ) {
			return { [ tagName ]: tag, ...answer };
		}
		else {
			return answer;
		}
	});
};

/**
 * Cleaning questions off tags from prior rounds
 *
 * @param  {array}  questions - An array of questions
 * @param  {string} tagName   - The name of the tag to be removed
 *
 * @return {array}            - A new array without the tags
 */
export function cleanTags( questions, tagName ) {
	return [ ...questions ].map( answer => {
		delete answer[ tagName ];
		return answer;
	});
};

/**
 * The main game where we pull each components together and store all the state we need for each game mode
 */
function Main() {
	const { questionsDB } = useQuestions();

	// state for image-to-text mode
	const [ questionsImage, setQuestionsImage ] = useState( shuffle( questionsDB ) );
	const [ indexImage, setIndexImage ] = useState( 0 );
	const newChoicesImage = getNewAnswers( questionsImage[ indexImage ], questionsImage );
	const [ choicesImage, setChoicesImage ] = useState( newChoicesImage );
	const [ correctImage, setCorrectImage ] = useState( null );
	const [ userAnswerImage, setUserAnswerImage ] = useState();
	const [ roundsImage, setRoundsImage ] = useState( 1 );

	// state for text-to-image mode
	const [ questionsText, setQuestionsText ] = useState( shuffle( questionsDB ) );
	const [ indexText, setIndexText ] = useState( 0 );
	const newChoicesText = getNewAnswers( questionsText[ indexText ], questionsText );
	const [ choicesText, setChoicesText ] = useState( newChoicesText );
	const [ correctText, setCorrectText ] = useState( null );
	const [ userAnswerText, setUserAnswerText ] = useState();
	const [ roundsText, setRoundsText ] = useState( 1 );

	const [ questionAsImage, setQuestionAsImage ] = useState( true );
	const [ score, setScore ] = useState( 0 );

	/**
	 * If we swap directions we toggle questionAsImage and switch to another question array
	 */
	function reverseDirection( event ) {
		setQuestionAsImage( !questionAsImage );
	};

	/**
	 * The user has found the right answer, let's now go to the next question
	 *
	 * @param  {array}    questions    - An array of question objects
	 * @param  {function} setQuestions - The state setter for questions
	 * @param  {integer}  index        - The current position we are at within the questions
	 * @param  {function} setIndex     - The state setter for index
	 * @param  {integer}  rounds       - The amount of rounds we have gone round about
	 * @param  {function} setRounds    - The state setter for rounds
	 * @param  {function} setCorrect   - The state setter for correct boolean
	 * @param  {function} setChoices   - The state setter for choices array
	 */
	function handleNextQuestion( questions, setQuestions, index, setIndex, rounds, setRounds, setCorrect, setChoices ) {
		setCorrect( null );

		let newIndex = index;
		if( index === questions.length - 1 ) {
			setQuestions( shuffle( cleanTags( questions, 'correct' ) ) );
			setRounds( rounds + 1 );
			setIndex( 0 );
		}
		else {
			newIndex ++;
			setIndex( newIndex );
		}
		const newChoices = getNewAnswers( questions[ newIndex ], questions );
		setChoices( newChoices );
	};

	/**
	 * The user has chosen and we now figure out what to do
	 *
	 * @param  {object}   event         - The event object to prevent default
	 * @param  {array}    questions     - An array of question objects
	 * @param  {function} setQuestions  - The state setter for questions
	 * @param  {array}    choices       - An array of choices for this questions
	 * @param  {function} setChoices    - The state setter for choices
	 * @param  {integer}  index         - The current position we are at within the questions
	 * @param  {string}   userAnswer    - The answer the user has given (image part)
	 * @param  {function} setUserAnswer - The state setter for answers
	 * @param  {function} setCorrect    - The state setter for correct boolean
	 * @param  {function} tagAnswer     - A function to tag the answer within the questions array
	 * @param  {integer}  score         - The current score
	 * @param  {function} setScore      - The state setter for score
	 */
	function handleAnswer( event, questions, setQuestions, choices, setChoices, index, userAnswer, setUserAnswer, setCorrect, tagAnswer, score, setScore ) {
		event.preventDefault();

		if( questions[ index ].image === userAnswer ) {
			setChoices( tagAnswer( choices, userAnswer, 'status', 'correct' ) );
			setQuestions( tagAnswer( questions, questions[ index ].image, 'correct', true ) );
			setCorrect( true );
			setScore( score + 1 );
		}
		else {
			setChoices( tagAnswer( choices, userAnswer, 'status', 'wrong' ) );
			setQuestions( tagAnswer( questions, questions[ index ].image, 'correct', false ) );
			setCorrect( false );
			setScore( score - 1 );
		}

		setUserAnswer( null );
	};

	/**
	 * =~=~=~=~=~=~=~=~=~=
	 */
	return (
		<main>
			<Body
				questions={ questionAsImage ? questionsImage : questionsText }
				setQuestions={ questionAsImage ? setQuestionsImage : setQuestionsText }
				index={ questionAsImage ? indexImage : indexText }
				setIndex={ questionAsImage ? setIndexImage : setIndexText }
				choices={ questionAsImage ? choicesImage : choicesText }
				setChoices={ questionAsImage ? setChoicesImage : setChoicesText }
				correct={ questionAsImage ? correctImage : correctText }
				setCorrect={ questionAsImage ? setCorrectImage : setCorrectText }
				userAnswer={ questionAsImage ? userAnswerImage : userAnswerText }
				setUserAnswer={ questionAsImage ? setUserAnswerImage : setUserAnswerText }
				rounds={ questionAsImage ? roundsImage : roundsText }
				setRounds={ questionAsImage ? setRoundsImage : setRoundsText }
				questionAsImage={ questionAsImage }
				score={ score }
				setScore={ setScore }
				reverseDirection={ reverseDirection }
				handleNextQuestion={ handleNextQuestion }
				handleAnswer={ handleAnswer }
			/>
		</main>
	);
};

Main.propTypes = {};

export default Main;
