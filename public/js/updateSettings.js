// updateData
import axios from 'axios';
import { showAlert } from './alerts';

// type is either 'password' or 'data'

export async function updateSettings(data, type) {
  try {
    const url =
      type === 'password'
        ? '/api/v1/users/updateMyPassword'
        : '/api/v1/users/updateMe';
    const res = await axios({
      method: 'PATCH',
      url: url,
      data,
    });

    if (res.data.status === 'success') {
      showAlert('success', `${type.toUpperCase()} sucessfully updated!`);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
}
