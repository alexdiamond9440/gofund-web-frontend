import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class Foundation extends Component {
	render() {
		return (
			<div className='error-page'>
				<div className='container'>
					<div className='row justify-content-center'>
						<div className='text-center'>
							<h4>Coming Soon...</h4>
							<h5>The page you are looking for is under construction.</h5>
							<Link
								className='btn btn-donate-big btn-active btn-transparent'
								to='/'
							>
								 Back To Home
							</Link>
						</div>
					</div>
				</div>
			</div>
		);
	}
}

export default Foundation;
