/** @format */

import React from 'react';
import { Button } from 'react-bootstrap';
import axios from 'axios';
import Swal from 'sweetalert2';
import { toastr } from 'react-redux-toastr';

function DeleteAccount() {
  const onDeleteButtonClick = () => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You want to delete your account',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    }).then(result => {
      if (result.value) {
        handleDelete();
        /* toastr.success("Your file has been deleted successfully"); */
      }
    });
  };
  const handleDelete = () => {
    let user = localStorage.getItem('user')
      ? JSON.parse(localStorage.getItem('user'))
      : '';
    const data = {
      projectId: user.id,
    };
    axios
      .delete('/users/delete-account', { data: data })
      .then(resp => {
        localStorage.removeItem('user');
        window.location.reload();
      })
      .catch(error => {
        let errorData = error.response ? error.response.data : error;
        toastr.error('Success', errorData.message);
      });
  };
  return (
    <div className='col-md-12 col-sm-12 dashboard-right-warp'>
      <div className='dashboard-right'>
        <div className='col-md-12'>
          <div className='big_label1 view_my'>
            {' '}
            <span>Delete Account</span>
          </div>
        </div>
        <div className='col-md-12'>
          <div className='delete-account-info'>
            Deleting your account and fundraising data is permanent. Your information can not be recovered.
          </div>
          <div className='delete-acc-btn-wrapper'>
            <Button
              bsStyle='danger'
              className='delete-acc-btn'
              onClick={onDeleteButtonClick}
            >
              Delete your account
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DeleteAccount;
