import Swal from 'sweetalert2';

export const success = async ({ title = 'OK', text = '' } = {}) => {
  await Swal.fire({ icon: 'success', title, text, timer: 1200, showConfirmButton: false, background: '#11103a', color: '#E8EAED' });
};

export const info = async ({ title = 'Info', text = '' } = {}) => {
  await Swal.fire({ icon: 'info', title, text, background: '#11103a', color: '#E8EAED' });
};

export default { success, info };

