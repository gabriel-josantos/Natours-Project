import '@babel/polyfill';
import { login, logout } from './login';
import { signup } from './signup';
import { displayMap } from './leaflet';
import { updateSettings } from './updateSettings';
import { bookTour } from './stripe';
import { forgetPassword, resetPassword } from './resetUserPassword';
import { showAlert } from './alerts';
//DOM ELEMENTS

const leaflet = document.getElementById('map');
const loginForm = document.querySelector('.form--login');
const signupForm = document.querySelector('.form--signup');
const logOutBtn = document.querySelector('.nav__el--logout');
const userDataForm = document.querySelector('.form-user-data');
const userSettingsForm = document.querySelector('.form-user-settings');
const bookBtn = document.getElementById('book-tour');
const forgetForm = document.querySelector('.form--forget-password');
const forgetBtn = document.querySelector('.btn--forget-password');
const resetForm = document.querySelector('.form--reset-password');

// DELEGATION

if (leaflet) {
  const locations = JSON.parse(leaflet.dataset.locations);
  displayMap(locations);
}
//////////////////
if (loginForm) {
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    await login(email, password);
  });
}
////////////////////
if (signupForm) {
  signupForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const passwordConfirm = document.getElementById('passwordConfirm').value;
    await signup(name, email, password, passwordConfirm);
  });
}
/////////////////////
if (logOutBtn) logOutBtn.addEventListener('click', logout);
/////////////////////////
if (userDataForm) {
  userDataForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const form = new FormData();
    form.append('name', document.getElementById('name').value);
    form.append('email', document.getElementById('email').value);
    form.append('photo', document.getElementById('photo').files[0]);
    await updateSettings(form, 'data');

    location.reload();
  });
}
////////////////////////
if (userSettingsForm) {
  userSettingsForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    document.querySelector('.btn--save-password ').textContent = 'Updating...';

    const currentPassword = document.getElementById('password-current').value;
    const newPassword = document.getElementById('password').value;
    const newPasswordConfirm =
      document.getElementById('password-confirm').value;

    await updateSettings(
      { currentPassword, newPassword, newPasswordConfirm },
      'password'
    );
    document.querySelector('.btn--save-password ').textContent =
      'Save password';

    document.getElementById('password-current').value = '';
    document.getElementById('password').value = '';
    document.getElementById('password-confirm').value = '';
  });
}
//////////////////////
if (bookBtn) {
  bookBtn.addEventListener('click', (e) => {
    e.target.textContent = 'Processing...';
    const tourId = e.target.dataset.tourId;
    bookTour(tourId);
  });
}
////////////////////////
if (forgetForm) {
  forgetForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    forgetBtn.textContent = 'Processing...';
    const email = document.getElementById('email').value;
    await forgetPassword(email);
    forgetBtn.textContent = 'Send password recovery link';
  });
}
//////////////////////////
if (resetForm) {
  resetForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const newPassword = document.getElementById('password').value;
    const newPasswordConfirm = document.getElementById('passwordConfirm').value;
    const token = e.target.dataset.token;
    await resetPassword(newPassword, newPasswordConfirm, token);
  });
}

const alertMessage = document.querySelector('body').dataset.alert;
if (alertMessage) showAlert('success', alertMessage, 20);
