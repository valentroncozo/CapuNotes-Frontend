// src/components/common/BackButton.jsx
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import '@/styles/back-button.css';
import { useNavigate } from 'react-router-dom';

export default function BackButton() {
  const navigate = useNavigate();
  return (
    <button
      type="button"
      className="back-button"
      aria-label="Volver"
      title="Volver"
      onClick={() => navigate(-1)}
    >
      <ArrowBackIcon className="back-icon" />
    </button>
  );
}
