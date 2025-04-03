import Modal from "react-modal";
import "./style.css";
import { FiX, FiAward, FiBarChart2, FiPieChart, FiTrash2, FiDownload } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useMemo, useRef } from "react";
import { toast } from "react-toastify";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

Modal.setAppElement("#root");

export default function ModalResults({ isOpen, onClose, results = {}, onReset = () => { } }) {
    const [showResults, setShowResults] = useState(false);
    const [totalVotes, setTotalVotes] = useState(0);
    const [winner, setWinner] = useState(null);
    const [whiteVotes, setWhiteVotes] = useState(0);
    const [showResetConfirm, setShowResetConfirm] = useState(false);
    const modalRef = useRef(null);

    const customStyles = {
        content: {
            top: "50%",
            left: "50%",
            right: "auto",
            bottom: "auto",
            transform: "translate(-50%, -50%)",
            width: "90%",
            maxWidth: "1000px",
            height: "auto",
            maxHeight: "95vh",
            backgroundColor: "#fff",
            borderRadius: "16px",
            padding: "0",
            border: "none",
            boxShadow: "0 10px 30px rgba(0, 0, 0, 0.2)",
            overflow: "auto",
        },
        overlay: {
            backgroundColor: "rgba(0, 0, 0, 0.7)",
            backdropFilter: "blur(5px)",
            zIndex: 1000,
        },
    };

    // Filtrar e ordenar os resultados (excluindo brancos)
    const sortedResults = useMemo(() => {
        return Object.entries(results)
            .filter(([name]) => name !== "Brancos")
            .sort((a, b) => b[1] - a[1]);
    }, [results]);

    useEffect(() => {
        if (isOpen && results) {
            setShowResults(false);
            const votes = Object.values(results).reduce((a, b) => a + b, 0);
            setTotalVotes(votes);
            setWhiteVotes(
                results.Brancos ||
                results.brancos ||
                results["Votos Brancos"] ||
                0
            );
            setWinner(sortedResults[0]);

            const timer = setTimeout(() => {
                setShowResults(true);
            }, 3000);

            return () => clearTimeout(timer);
        }
    }, [isOpen, results, sortedResults]);

    const calculatePercentage = (votes) => {
        return totalVotes > 0 ? Math.round((votes / totalVotes) * 100) : 0;
    };

    const handleResetVotes = () => {
        setShowResetConfirm(true);
    };

    const confirmReset = () => {
        try {
            // Verifica se onReset é uma função válida
            if (typeof onReset === 'function') {
                onReset();
            } else {
                console.warn('onReset não é uma função');
            }

            // Remove do localStorage
            localStorage.removeItem('electionVotes');

            // Verifica se realmente foi removido
            if (localStorage.getItem('electionVotes') !== null) {
                console.warn('Os dados não foram removidos do localStorage');
            }

            toast.success("Votação zerada com sucesso!");
            setShowResetConfirm(false);
            onClose();
        } catch (error) {
            console.error('Erro ao resetar votos:', error);
            toast.error("Ocorreu um erro ao zerar a votação");
        }
    };

    const exportToPDF = async () => {
        if (!modalRef.current) {
            toast.error("Elemento não encontrado para exportação");
            return;
        }

        toast.info("Gerando PDF...");
        try {
            const options = {
                scale: 2,
                useCORS: true,
                scrollX: 0,
                scrollY: -window.scrollY,
                windowWidth: document.documentElement.scrollWidth,
                windowHeight: document.documentElement.scrollHeight,
                allowTaint: true
            };

            const canvas = await html2canvas(modalRef.current, options);
            const imgData = canvas.toDataURL("image/png", 1.0);
            const pdf = new jsPDF("p", "mm", "a4");
            const imgWidth = 210;
            const imgHeight = (canvas.height * imgWidth) / canvas.width;
            pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);

            if (imgHeight > 295) {
                let yPosition = 0;
                let heightLeft = imgHeight;
                while (heightLeft > 0) {
                    pdf.addPage();
                    pdf.addImage(imgData, "PNG", 0, yPosition - imgHeight, imgWidth, imgHeight);
                    heightLeft -= 295;
                    yPosition -= 295;
                }
            }

            pdf.save(`resultados-eleicao-${new Date().toISOString().slice(0, 10)}.pdf`);
            toast.success("PDF gerado com sucesso!");
        } catch (error) {
            console.error("Erro ao gerar PDF:", error);
            toast.error(`Falha ao gerar PDF: ${error.message}`);
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onClose}
            style={customStyles}
            closeTimeoutMS={300}
            ariaHideApp={!process.env.NODE_ENV === 'test'}
            shouldCloseOnOverlayClick={true}
            shouldCloseOnEsc={true}
            preventScroll={true}
        >
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        ref={modalRef}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                        data-testid="results-modal"
                    >
                        <header className="header-modal">
                            <h2>Resultados da Eleição</h2>
                            <div className="modal-header-actions">
                                <button
                                    className="reset-button"
                                    onClick={handleResetVotes}
                                    aria-label="Zerar votação"
                                >
                                    <FiTrash2 size={20} />
                                    <span>Zerar <span className="text-votacao">Votação</span></span>
                                </button>
                                <button
                                    className="export-button"
                                    onClick={exportToPDF}
                                    aria-label="Exportar para PDF"
                                >
                                    <FiDownload size={20} />
                                    <span>Exportar</span>
                                </button>
                                <div
                                    className="area-close"
                                    onClick={onClose}
                                    role="button"
                                    tabIndex={0}
                                    aria-label="Fechar modal"
                                    onKeyDown={(e) => e.key === 'Enter' && onClose()}
                                >
                                    <FiX size={24} />
                                </div>
                            </div>
                        </header>

                        <main className="main-modal">
                            {!showResults ? (
                                <div className="loading-results">
                                    <motion.div
                                        animate={{
                                            scale: [1, 1.1, 1],
                                            opacity: [0.8, 1, 0.8]
                                        }}
                                        transition={{
                                            repeat: Infinity,
                                            duration: 1.5,
                                            ease: "easeInOut"
                                        }}
                                    >
                                        <FiBarChart2 size={60} />
                                    </motion.div>
                                    <h3>Calculando resultados...</h3>
                                    <p>Os votos estão sendo contabilizados</p>
                                </div>
                            ) : (
                                <>
                                    {showResetConfirm ? (
                                        <div className="reset-confirmation">
                                            <h3>Tem certeza que deseja zerar a votação?</h3>
                                            <p>Todos os votos serão permanentemente apagados.</p>
                                            <div className="reset-actions">
                                                <button
                                                    className="cancel-button"
                                                    onClick={() => setShowResetConfirm(false)}
                                                >
                                                    Cancelar
                                                </button>
                                                <button
                                                    className="confirm-reset-button"
                                                    onClick={confirmReset}
                                                >
                                                    Confirmar
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <>
                                            <div className="winner-section">
                                                <div className="winner-badge">
                                                    <FiAward size={32} />
                                                    <span>CHAPA VENCEDORA</span>
                                                </div>
                                                <h3>{winner?.[0] || "N/A"}</h3>
                                                <div className="winner-stats">
                                                    <div className="stat-box">
                                                        <span className="stat-value">{winner?.[1] || 0}</span>
                                                        <span className="stat-label">Votos</span>
                                                    </div>
                                                    <div className="stat-box highlight">
                                                        <span className="stat-value">
                                                            {winner ? calculatePercentage(winner[1]) : 0}%
                                                        </span>
                                                        <span className="stat-label">do total</span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="results-container">
                                                <div className="table-container">
                                                    <table className="results-table" aria-label="Resultados por chapa">
                                                        <thead>
                                                            <tr>
                                                                <th>Posição</th>
                                                                <th>Chapa</th>
                                                                <th>Votos</th>
                                                                <th>%</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {sortedResults.map(([name, votes], index) => (
                                                                <motion.tr
                                                                    key={name}
                                                                    initial={{ opacity: 0, y: 10 }}
                                                                    animate={{ opacity: 1, y: 0 }}
                                                                    transition={{
                                                                        delay: index * 0.1,
                                                                        type: "spring",
                                                                        stiffness: 100
                                                                    }}
                                                                >
                                                                    <td>
                                                                        {index === 0 ? (
                                                                            <span className="gold">1º</span>
                                                                        ) : index === 1 ? (
                                                                            <span className="silver">2º</span>
                                                                        ) : index === 2 ? (
                                                                            <span className="bronze">3º</span>
                                                                        ) : (
                                                                            `${index + 1}º`
                                                                        )}
                                                                    </td>
                                                                    <td>{name}</td>
                                                                    <td>{votes}</td>
                                                                    <td>
                                                                        <div className="percentage-bar-container">
                                                                            <div
                                                                                className="percentage-bar"
                                                                                style={{ width: `${calculatePercentage(votes)}%` }}
                                                                            ></div>
                                                                            <span>{calculatePercentage(votes)}%</span>
                                                                        </div>
                                                                    </td>
                                                                </motion.tr>
                                                            ))}
                                                        </tbody>
                                                    </table>
                                                </div>

                                                <div className="white-votes-section">
                                                    <div className="white-votes-card">
                                                        <FiPieChart size={32} className="white-votes-icon" />
                                                        <div className="white-votes-content">
                                                            <h3>Votos Brancos</h3>
                                                            <div className="white-votes-stats">
                                                                <span className="white-votes-count">{whiteVotes}</span>
                                                                <span className="white-votes-percentage">
                                                                    ({calculatePercentage(whiteVotes)}% do total)
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="votes-summary">
                                                    <div className="vote-category">
                                                        <div className="vote-type">
                                                            <FiPieChart size={20} />
                                                            <span>Total de votos válidos:</span>
                                                        </div>
                                                        <strong>{totalVotes - whiteVotes}</strong>
                                                    </div>
                                                    <div className="vote-category total">
                                                        <div className="vote-type">
                                                            <FiPieChart size={20} />
                                                            <span>Total geral de votos:</span>
                                                        </div>
                                                        <strong>{totalVotes}</strong>
                                                    </div>
                                                </div>
                                            </div>
                                        </>
                                    )}
                                </>
                            )}
                        </main>
                    </motion.div>
                )}
            </AnimatePresence>
        </Modal>
    );
}