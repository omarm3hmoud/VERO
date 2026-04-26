import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Code2, MessageCircle, MonitorSmartphone } from 'lucide-react';

export default function DeveloperCredit() {
    const [isVisible, setIsVisible] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [hasBeenDismissed, setHasBeenDismissed] = useState(false);

    useEffect(() => {
        const visibleSections = new Set();
        
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        visibleSections.add(entry.target);
                    } else {
                        visibleSections.delete(entry.target);
                    }
                });
                
                // Show if we are in the last sections
                if (visibleSections.size > 0 && !hasBeenDismissed) {
                    setIsVisible(true);
                } else {
                    setIsVisible(false);
                }
            },
            { threshold: 0.05 }
        );

        // Target the last 3 sections (Features, Order, About, Footer)
        const targetSections = document.querySelectorAll('#features, #order, #about, footer');
        targetSections.forEach(sec => {
            if(sec) observer.observe(sec);
        });

        return () => {
            targetSections.forEach(sec => {
                if(sec) observer.unobserve(sec);
            });
            visibleSections.clear();
        };
    }, [hasBeenDismissed]);

    const handleDismiss = (e) => {
        e.stopPropagation();
        setIsVisible(false);
        setHasBeenDismissed(true);
    };

    return (
        <>
            {/* The Floating Notification */}
            <AnimatePresence>
                {isVisible && !isOpen && (
                    <motion.div
                        initial={{ opacity: 0, x: 100 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 100 }}
                        transition={{ type: "spring", stiffness: 300, damping: 25 }}
                        className="dev-credit-floating"
                        onClick={() => setIsOpen(true)}
                    >
                        <div className="dev-credit-card">
                            <div className="dev-credit-shine"></div>
                            <img 
                                src="/developer.jpeg" 
                                alt="Omar Mahmoud" 
                                className="dev-credit-avatar"
                                onError={(e) => {e.target.src = 'https://ui-avatars.com/api/?name=Omar+Mahmoud&background=111&color=C9A84C'}}
                            />
                            <div className="dev-credit-text">
                                <p className="dev-credit-title">Developed by</p>
                                <p className="dev-credit-name">Omar Mahmoud</p>
                            </div>
                            <button onClick={handleDismiss} className="dev-credit-close">
                                <X size={12} />
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* The Developer Modal */}
            <AnimatePresence>
                {isOpen && (
                    <div className="dev-modal-overlay">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsOpen(false)}
                            className="dev-modal-backdrop"
                        />
                        
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="dev-modal-content"
                        >
                            <button onClick={() => setIsOpen(false)} className="dev-modal-close-btn">
                                <X size={16} />
                            </button>

                            <div className="dev-modal-body">
                                <div className="dev-modal-avatar-wrap">
                                    <div className="dev-modal-avatar-glow"></div>
                                    <img 
                                        src="/developer.jpeg" 
                                        alt="Omar Mahmoud" 
                                        className="dev-modal-avatar-large"
                                        onError={(e) => {e.target.src = 'https://ui-avatars.com/api/?name=Omar+Mahmoud&background=111&color=C9A84C'}}
                                    />
                                    <div className="dev-modal-badge">
                                        <Code2 size={14} color="#000" />
                                    </div>
                                </div>

                                <h3 className="dev-modal-name">Omar Mahmoud</h3>
                                <p className="dev-modal-role">
                                    <MonitorSmartphone size={14} /> 
                                    Software Engineer   
                                </p>

                                <div className="dev-modal-bio">
                                    <div className="bio-quote-icon">"</div>
                                    <p dir="rtl">
                                        أتمنى أن يكون تصميم وأداء الموقع قد نال إعجابكم. 
                                        <br/><br/>
                                        لو ليك أي تقييم لتجربة المستخدم، أو محتاج أي تعديلات فنية، أو حابب تصمم موقع مميز لمشروعك، متترددش في التواصل معايا.
                                    </p>
                                </div>

                                <div className="dev-modal-contact-divider">
                                    <span>للتواصل</span>
                                </div>

                                <div className="dev-modal-socials">
                                    <a href="https://wa.me/201016407214" target="_blank" rel="noopener noreferrer" className="social-link whatsapp">
                                        <div className="social-icon"><MessageCircle size={20} /></div>
                                        <span>WhatsApp</span>
                                    </a>

                                    <a href="https://www.linkedin.com/in/omar-m3hmoud" target="_blank" rel="noopener noreferrer" className="social-link linkedin">
                                        <div className="social-icon">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
                                        </div>
                                        <span>LinkedIn</span>
                                    </a>

                                    <a href="https://www.instagram.com/omar_m3hmoud" target="_blank" rel="noopener noreferrer" className="social-link instagram">
                                        <div className="social-icon">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
                                        </div>
                                        <span>Instagram</span>
                                    </a>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </>
    );
}
