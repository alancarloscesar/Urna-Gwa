import './App.css'
import { useState } from 'react'

function App() {

  const [num, setNum] = useState(0);

  const [plate1, setPlate1] = useState(0);
  const [plate2, setPlate2] = useState(0);
  const [plate3, setPlate3] = useState(0);
  const [white, setWhite] = useState(0);

  function inputNum(e) {
    let value = parseInt(e.target.value);

    if (num == 0) {
      setNum(value)
    }
  }

  function whiteVote(){
    setWhite(white + 1)
  }

  function confirmVote() {
    if (num === 1) {
      setPlate1(plate1 + 1);
    } else if (num === 2) {
      setPlate2(plate2 + 1);
    } else if (num === 3) {
      setPlate3(plate3 + 1);
    }
    setNum(0);
  }

  return (
    <>
      <div>
        <div className="content">
          <div className="container">
            <header>
              <h1>
                Eleição grêmio estudantil GWA
              </h1>
            </header>
            <main>
              <div className="fieldNumberPlate">
                {num}
              </div> 
              <div className="div-buttons">
                <button className='button-numberPlate' value={1} onClick={inputNum}>1</button>
                <button className='button-numberPlate' value={2} onClick={inputNum}>2</button>
                <button className='button-numberPlate' value={3} onClick={inputNum}>3</button>
              </div>
            </main>

            <footer>
              <button className='button-white' onClick={whiteVote}>Branco</button>
              <button className='button-confirm' onClick={confirmVote}>Confirmar</button>
            </footer>
          </div>

          <div className="membersPhotos">

          <div className="results">
            <h2>Resultados</h2>
            <p>Chapa 1: {plate1} votos</p>
            <p>Chapa 2: {plate2} votos</p>
            <p>Chapa 3: {plate3} votos</p>
            <p>branco: {white} votos</p>
          </div>

          </div>
        </div>

      </div>

    </>
  )
}

export default App
