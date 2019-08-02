/** @jsx jsx */
import { useState, useEffect } from 'react';
import useRemoteData from './useRemoteData';
import { Link } from '@reach/router';
import { jsx } from '@emotion/core';
import Loading from './loading';

function Highscore() {
	const [ highscore, setHighscore ] = useState([]);

	const { data, loadingState } = useRemoteData('http://localhost:5555/api/highscore');
	useEffect( () => {
		if( loadingState === 'loaded' ) {
			setHighscore( data );
		}
	}, [ data, loadingState, setHighscore ]);

	return (
		<Loading data={ highscore } loadingState={ loadingState }>
			Higscore yay!
			<Link to='/'>Go back</Link>
			data: { JSON.stringify(highscore) }
		</Loading>
	);
};

Highscore.propTypes = {};

export default Highscore;
