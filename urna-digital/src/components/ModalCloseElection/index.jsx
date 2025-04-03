import Modal from "react-modal";
import './style.css';
import { FiX, FiLock } from "react-icons/fi";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";

Modal.setAppElement('#root');

export default function ModalCloseElection({ isOpen, onClose, onConfirm }) {
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const customStylesModal = {
    content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      transform: 'translate(-50%, -50%)',
      backgroundColor: '#ffffff',
      borderRadius: '16px',
      padding: '0',
      width: '90%',
      maxWidth: '450px',
      border: 'none',
      boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)',
      overflow: 'hidden',
    },
    overlay: {
      backgroundColor: 'rgba(0, 0, 0, 0.6)',
      backdropFilter: 'blur(4px)',
      zIndex: 1000
    },
  };

  function handleConfirmPass() {
    if (!password) {
      toast.error("Por favor, digite a senha!");
      return;
    }

    setIsLoading(true);

    // Simula uma verificação assíncrona
    setTimeout(() => {
      if (password === 'gwa2025') {
        toast.success("Eleição encerrada com sucesso!");
        onConfirm();
        onClose();
      } else {
        toast.error("Senha incorreta!");
        setPassword('');
      }
      setIsLoading(false);
    }, 800);
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleConfirmPass();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      style={customStylesModal}
      closeTimeoutMS={300}
    >
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
          >
            <header className="header-modal">
              <h2>Encerrar Eleição</h2>
              <div className="area-close" onClick={onClose}>
                <FiX size={24} />
              </div>
            </header>

            <main className="main-modal">
              <p className="warning-text">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 8V12M12 16H12.01M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z" stroke="#FF6B6B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Apenas administradores podem encerrar a eleição
              </p>
              <div className="password-input-container">
                <FiLock size={20} className="lock-icon" />
                <input
                  type="password"
                  placeholder="Digite a senha..."
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyPress={handleKeyPress}
                  autoFocus
                />
              </div>

            </main>

            <footer className="modal-footer">
              <button
                onClick={onClose}
                className="cancel-btn"
                disabled={isLoading}
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirmPass}
                className="confirmar-btn"
                disabled={isLoading || !password}
              >
                {isLoading ? (
                  <span className="loading-spinner"></span>
                ) : 'Confirmar'}
              </button>
            </footer>
          </motion.div>
        )}
      </AnimatePresence>
    </Modal>
  );
}