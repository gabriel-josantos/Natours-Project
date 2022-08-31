import axios from 'axios';
import { showAlert } from './alerts';

export async function signup(name, email, password, passwordConfirm) {
  try {
    document.querySelector('.btn--signup').textContent =
      'Signing Up...Please wait';
    const res = await axios({
      method: 'POST',
      url: '/api/v1/users/signup',
      data: {
        name,
        email,
        password,
        passwordConfirm,
      },
    });

    document.querySelector('.btn--signup').textContent = 'Sign Up';

    if (res.data.status === 'success') {
      showAlert('success', 'You successfully created your account');
      window.setTimeout(() => {
        location.assign('/');
      }, 1500);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
}
