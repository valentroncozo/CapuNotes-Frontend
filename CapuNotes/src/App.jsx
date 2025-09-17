import './App.css';
import Login from './components/login'; // 👈 importamos el componente Login

function App() {
  return (
    <div className="App">
      <Login /> {/* 👈 mostramos la pantalla de login */}
    </div>
  );
}

export default App;
