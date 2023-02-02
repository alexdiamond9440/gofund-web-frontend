import React from 'react'
import { Modal } from "react-bootstrap";

const AddAccountInfo = (props) => {
	const { handleModalClose, isDataLoading, handleSubmit, handleChange, routingNumber, accountNumber, show, errMsg } = props
	return (
		<Modal
			show={show}
			onHide={handleModalClose}
			className='authorizemodal'
			backdrop={'static'}
		>
			<Modal.Header closeButton>
				<Modal.Title id='contained-modal-title'>
					Add external account
				</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<form
					onSubmit={handleSubmit}
					noValidate
					className='row'
				>
					<div className='col-md-12 center-block'>
						<div className='row '>
							<div className='form-group col-md-12'>
								<label>
									Bank Routing Number
									<span className='mandatory'>*</span>
								</label>
								<div>
									<input
										className='form-control'
										placeholder='Bank Routing Number'
										name='routingNumber'
										onChange={handleChange}
										value={routingNumber}
										maxLength='9'
										required
									/>
								</div>
								{errMsg && errMsg['routingNumber'] ? (
									<div className='text-danger'>
										{errMsg['routingNumber']}
									</div>
								) : (
									''
								)}
							</div>
							<div className='form-group col-md-12'>
								<label>
									Account Number
									<span className='mandatory'>*</span>
								</label>
								<div>
									<input
										className='form-control'
										placeholder='Account Number'
										name='accountNumber'
										onChange={handleChange}
										value={accountNumber}
										maxLength='17'
										required
									/>
								</div>
								<div className="info-text">Your bank account must be a checking account.</div>
								{errMsg && errMsg['accountNumber'] ? (
									<div className='text-danger'>
										{errMsg['accountNumber']}
									</div>
								) : (
									''
								)}
							</div>
						</div>
						<div className='row'>
							<div className='form-actions form-btn-block text-center'>
								{!isDataLoading ? (
									<button
										// onClick={this.handleSubmit}
										className='btn btn-donate-big'
										type='submit'
									>
										Save
									</button>
								) : (
									<button className='btn btn-donate-big' disabled>
										Saving...
									</button>
								)}
							</div>
						</div>
					</div>
				</form>
			</Modal.Body>
		</Modal>
	)
}
export default AddAccountInfo