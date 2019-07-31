/** @jsx jsx */
import { jsx } from '@emotion/core';
import PropTypes from 'prop-types';
import { Fragment } from 'react';
import { colors } from './theme';

/**
 * A component to show the progress as dashes
 */
function Progress({ questions, current, rounds }) {
	return (
		<Fragment>
				<ul css={{
				padding: 0,
				listStyle: 'none',
				display: 'flex',
				width: '98%',
				margin: '0 1%',
				boxSizing: 'border-box',
			}}>
				{
					questions.map( ( question, i ) => (
						<li key={ i } css={{
							display: 'inline-block',
							flex: 1,
							borderTop: `4px solid ${
								current === i
									? colors[ 2 ]   // if it's the current question
									: i < current   // if it was in the past and ...
										? !question.correct
											? colors[ 0 ] // ... it was the wrong answer
											: colors[ 3 ] // ... it was the right answer
										: colors[ 4 ] // if it's in the future
								}`,
							margin: '0 2px',
						}}></li>
					))
				}
			</ul>
			<span>{ rounds }</span>
		</Fragment>
	);
};

Progress.propTypes = {
	questions: PropTypes.array.isRequired,
	current: PropTypes.number.isRequired,
	rounds: PropTypes.number.isRequired,
};

export default Progress;
