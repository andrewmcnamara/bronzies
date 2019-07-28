/** @jsx jsx */
import { useSpring, animated } from 'react-spring';
import ImageView from './imageView';
import { jsx } from '@emotion/core';
import PropTypes from 'prop-types';
import TextView from './textView';

function Choises({ items, questionAsImage, onAnswer, onSuccess, correct }) {
	const { right } = useSpring({
		right: correct ? '0px' : '-300px',
	});

	right.interpolate( o => console.log(o) );

	return (
		<ul css={{
			padding: 0,
			margin: 0,
		}}>
			{
				items.map( ( item, key ) => (
					<li key={ key } css={{
						position: 'relative',
						listStyle: 'none',
					}}>
						<button css={{
							display: 'block',
							appearance: 'none',
							width: '100%',
							background: item.status
								? item.status=== 'correct'
									? '#325C3B'
									: '#EA1C2E'
								: 'transparent',
							padding: '12px',
							border: 'none',
							transition: 'background 0.3s ease, opcaity 0.3s ease, color 0.3s ease',
							fontSize: '21px',
							lineHeight: 1.2,
							'&:disabled': {
								color: '#fff',
							}
						}} type='submit' onClick={ event => onAnswer( item.image ) } disabled={ item.status }>
							{
								questionAsImage
									? <TextView text={ item.text } />
									: <ImageView item={ item.image } />
							}
						</button>
						<animated.div style={{ right }} css={{
							position: 'absolute',
							display: item.status === 'correct' ? 'block' : 'none',
							top: 0,
							width: '300px',
						}}>
							<button type='button' onClick={ onSuccess } css={{
								display: 'block',
								appearance: 'none',
								width: '300px',
								background: '#fff',
								color: '#000',
								padding: '12px',
								border: 'none',
								fontSize: '21px',
								lineHeight: 1.2,
							}}>Next question</button>
						</animated.div>
					</li>
				))
			}
		</ul>
	);
};

Choises.propTypes = {
	items: PropTypes.array.isRequired,
	questionAsImage: PropTypes.bool.isRequired,
	onAnswer: PropTypes.func.isRequired,
	onSuccess: PropTypes.func.isRequired,
};

export default Choises;
