import React, { useState } from 'react';
import { CheckCircle } from 'lucide-react';

const AvatarModal = ({ onSelect, onClose }) => {
  const [selectedAvatar, setSelectedAvatar] = useState(null);

  // Lista de avatares (pode substituir pelas suas imagens)
  const avatars = [
    { id: 1, url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=1' },
    { id: 2, url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=2' },
    { id: 3, url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=3' },
    { id: 4, url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=4' },
    { id: 5, url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=5' },
    { id: 6, url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=6' },
    { id: 7, url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=7' },
    { id: 8, url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=8' },
  ];

  const handleConfirm = () => {
    if (selectedAvatar) {
      onSelect(selectedAvatar);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="bg-slate-800 rounded-2xl shadow-2xl p-8 max-w-2xl w-full mx-4 border border-slate-700">
        <h2 className="text-2xl font-bold text-white mb-4">Escolha seu Avatar</h2>
        <div className="grid grid-cols-4 gap-4 mb-6 max-h-96 overflow-y-auto">
          {avatars.map((avatar) => (
            <button
              key={avatar.id}
              onClick={() => setSelectedAvatar(avatar)}
              className={`relative p-2 rounded-xl transition-all border-2 ${
                selectedAvatar?.id === avatar.id
                  ? 'border-cyan-500 scale-105'
                  : 'border-transparent hover:border-slate-400'
              }`}
            >
              <img
                src={avatar.url}
                alt={`Avatar ${avatar.id}`}
                className="w-full h-full object-cover rounded-lg"
              />
              {selectedAvatar?.id === avatar.id && (
                <CheckCircle className="absolute top-1 right-1 w-5 h-5 text-cyan-500" />
              )}
            </button>
          ))}
        </div>

        <div className="flex gap-4">
          <button
            onClick={onClose}
            className="flex-1 bg-slate-700 hover:bg-slate-600 text-white font-medium py-3 rounded-lg transition-all"
          >
            Cancelar
          </button>
          <button
            onClick={handleConfirm}
            disabled={!selectedAvatar}
            className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-semibold py-3 rounded-lg hover:from-cyan-600 hover:to-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            Confirmar
          </button>
        </div>
      </div>
    </div>
  );
};

export default AvatarModal;