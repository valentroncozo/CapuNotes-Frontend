// src/components/common/BackButton.jsx
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import '@/styles/back-button.css';
import { useNavigate } from 'react-router-dom';
import Button from 'react-bootstrap/Button';

const BackButton = () => {
  const navigate = useNavigate();
  return (
    <Button className="back-button" onClick={() => navigate(-1)} title="Volver">
      <ArrowBackIcon className="back-icon" />
    </Button>
  );
};
export default BackButton;
