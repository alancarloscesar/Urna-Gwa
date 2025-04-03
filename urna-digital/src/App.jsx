import './App.css';
import { useState, useEffect } from 'react';
import { GrDeploy } from "react-icons/gr";
import ModalCloseElection from './components/ModalCloseElection';
import ModalResults from './components/ModalResults';
import { toast } from 'react-toastify';
import logo from "../img/logo.png";
import { motion, AnimatePresence } from 'framer-motion';

const INITIAL_STATE = {
  plate1: 0,
  plate2: 0,
  plate3: 0,
  white: 0,
  selectedNum: null
};

function App() {
  const [votes, setVotes] = useState(() => {
    const savedVotes = localStorage.getItem('electionVotes');
    return savedVotes ? JSON.parse(savedVotes) : INITIAL_STATE;
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isResultsOpen, setIsResultsOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('electionVotes', JSON.stringify(votes));
  }, [votes]);

  function inputNum(e) {
    const value = parseInt(e.target.value);
    setVotes(prev => ({
      ...prev,
      selectedNum: value
    }));
  }

  function whiteVote() {
    if (votes.selectedNum !== null) return;

    setVotes(prev => ({
      ...prev,
      white: prev.white + 1,
      selectedNum: null
    }));
    toast.success("Voto em branco confirmado!");
  }

  function confirmVote() {
    if (votes.selectedNum === null) {
      toast.error("Selecione uma chapa primeiro!");
      return;
    }

    const plateKey = `plate${votes.selectedNum}`;
    setVotes(prev => ({
      ...prev,
      [plateKey]: prev[plateKey] + 1,
      selectedNum: null
    }));
    toast.success("Voto confirmado!");
  }

  function resetSelection() {
    setVotes(prev => ({
      ...prev,
      selectedNum: null
    }));
  }

  function openModal() {
    setIsModalOpen(true);
  }

  function closeModal() {
    setIsModalOpen(false);
  }

  function closeResultsModal() {
    setIsResultsOpen(false);
  }

  function handleEndElection() {
    setIsResultsOpen(true);
  }

  return (
    <div className="app-container">
      <div className="content">
        <motion.div
          className="container"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <header>
            <div className="tit-img">
              <img id='img-logo' src={logo} alt="Logo da Eleição" />
              <motion.h1
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                Eleição Grêmio Estudantil 2025
              </motion.h1>
            </div>
            <div className="line"></div>
            <motion.p
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              1. Escolha a chapa de sua preferência
            </motion.p>
            <motion.p
              id='p2'
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              2. Em seguida clique no botão verde para confirmar
            </motion.p>
            <div className="line"></div>
          </header>

          <main>
            <div className="div-buttons">
              {[1, 2, 3].map(num => (
                <motion.button
                  key={num}
                  className={`button-numberPlate ${votes.selectedNum === num ? 'selected' : ''}`}
                  value={num}
                  onClick={inputNum}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 + num * 0.1 }}
                >
                  {num}
                </motion.button>
              ))}
            </div>

            <div className="div-btn">
              <motion.button
                className='button-white'
                onClick={whiteVote}
                disabled={votes.selectedNum !== null}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
              >
                Branco
              </motion.button>

              {votes.selectedNum !== null && (
                <motion.button
                  className='button-cancel'
                  onClick={resetSelection}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.1 }}
                >
                  Cancelar
                </motion.button>
              )}

              <motion.button
                className='button-confirm'
                onClick={confirmVote}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.1 }}
              >
                Confirmar
              </motion.button>
            </div>
          </main>
        </motion.div>
      </div>

      <motion.button
        className='finished-election'
        title='Encerrar eleição'
        onClick={openModal}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <GrDeploy />
      </motion.button>

      <AnimatePresence>
        {isModalOpen && (
          <ModalCloseElection
            isOpen={isModalOpen}
            onClose={closeModal}
            onConfirm={handleEndElection}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isResultsOpen && (
          <ModalResults
            isOpen={isResultsOpen}
            onClose={closeResultsModal}
            results={{
              "Chapa 1": votes.plate1,
              "Chapa 2": votes.plate2,
              "Chapa 3": votes.plate3,
              "Brancos": votes.white
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;