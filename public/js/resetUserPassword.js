import axios from 'axios';
import { showAlert } from './alerts';

export async function forgetPassword(email) {
  try {
    const res = await axios({
      method: 'POST',
      url: '/api/v1/users/forgotPassword',
      data: {
        email: email,
      },
    });

    if (res.data.status === 'success') {
      showAlert('success', 'Password reset link sent to yout email');
      window.setTimeout(() => {
        location.assign('/');
      }, 1500);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
}

export async function resetPassword(newPassword, newPasswordConfirm, token) {
  try {
    console.log(token)
    const res = await axios({
      method: 'PATCH',
      url: `/api/v1/users/resetPassword/${token}`,
      data: {
        newPassword,
        newPasswordConfirm,
      },
    });

    if (res.data.status === 'success') {
      showAlert('success', 'Password successfully changed');
      window.setTimeout(() => {
        location.assign('/login');
      }, 1500);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
}
