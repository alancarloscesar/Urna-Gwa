import Modal from "react-modal";
import './style.css';
import { FiX } from "react-icons/fi";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";

// Definindo o elemento raiz para acessibilidade
Modal.setAppElement('#root');

export default function ModalCloseElection() {
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [password, setPassword] = useState('');

  function openModal() {
    setIsOpenModal(true);
  }

  function closeModal() {
    setIsOpenModal(false);
  }

  useEffect(() => {
    openModal();
  }, []);

  const customStylesModal = {
    content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
      backgroundColor: '#f0f0f0',
      border: '1px solid #ccc',
      borderRadius: '10px',
      padding: '20px',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      width: '35vw',
      height: '30vh',
      maxWidth: '90%',
      color: '#6c6c6c',
    },
    overlay: {
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
  };


  function handleConfirmPass() {
    if (password === 'gwa2025') {
      toast.success("Eleição encerrada com sucesso!");
      // logica para mostrar ou gerar pdf do resultado
    } else {
      toast.error("Senha incorreta!");
    }
  }

  return (
    <>
      <Modal
        isOpen={isOpenModal}
        onRequestClose={closeModal}
        style={customStylesModal}
        shouldCloseOnOverlayClick={false}
      >
        <header className="header-modal">
          <div className="area-close" onClick={closeModal}>
            <FiX size={24} />
          </div>
        </header>
        <main className="main-modal">
          <input type="password" placeholder="Digite a senha..." onChange={(e) => setPassword(e.target.value)} />
        </main>
        <button onClick={handleConfirmPass} className="confirmar-btn">Confirmar</button>
      </Modal>
    </>
  );
}
