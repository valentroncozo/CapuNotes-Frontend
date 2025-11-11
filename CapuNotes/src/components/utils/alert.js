import Swal from 'sweetalert2';

const DEFAULT_BG = '#11103a';
const DEFAULT_COLOR = '#E8EAED';

export const success = async ({ title = 'OK', text = '' } = {}) => {
  await Swal.fire({
    icon: 'success',
    title,
    text,
    timer: 1200,
    showConfirmButton: false,
    background: DEFAULT_BG,
    color: DEFAULT_COLOR,
  });
};

export const info = async ({ title = 'Info', text = '' } = {}) => {
  await Swal.fire({
    icon: 'info',
    title,
    text,
    background: DEFAULT_BG,
    color: DEFAULT_COLOR,
  });
};

export const error = async ({ title = 'Error', message = '' } = {}) => {
  if (message) {
    alert(`Error: ${title}\n${message}`);
  } else {
    alert(`Error: ${title}`);
  }
}

export const warning = async ({ title = 'Advertencia', message = '' } = {}) => {
  if (message) {
    alert(`Advertencia: ${title}\n${message}`);
  } else {
    alert(`Advertencia: ${title}`);
  }
}

export const confirmDialog = async ({ title = 'Confirmar', message = '' } = {}) => {
  const text = message ? `${title}\n${message}` : title;
  return window.confirm(text);
}

export default { success, info, error, warning, confirmDialog };