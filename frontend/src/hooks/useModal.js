// src/hooks/useModal.js
import { useState, useCallback } from 'react';

/**
 * Hook for managing modal state
 * 
 * @param {boolean} initialState - Initial open state (default: false)
 * 
 * @returns {Object} { isOpen, data, open, close, toggle }
 * 
 * @example
 * const modal = useModal();
 * <button onClick={() => modal.open({ id: 1 })}>Open</button>
 * <Modal isOpen={modal.isOpen} onClose={modal.close}>
 *   <p>Data: {modal.data?.id}</p>
 * </Modal>
 */
export const useModal = (initialState = false) => {
  const [isOpen, setIsOpen] = useState(initialState);
  const [data, setData] = useState(null);

  const open = useCallback((modalData = null) => {
    setData(modalData);
    setIsOpen(true);
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
    // Optional: Clear data after animation
    setTimeout(() => {
      setData(null);
    }, 300);
  }, []);

  const toggle = useCallback(() => {
    setIsOpen(prev => !prev);
  }, []);

  const setModalData = useCallback((newData) => {
    setData(newData);
  }, []);

  return { 
    isOpen, 
    data, 
    open, 
    close, 
    toggle,
    setModalData
  };
};