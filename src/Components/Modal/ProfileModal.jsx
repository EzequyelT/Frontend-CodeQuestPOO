import { LogOut, User, X, Mail, Shield, ChevronRight, Settings } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function ProfileModal({ user, onClose }) {
  const navigate = useNavigate();

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');

        .profile-modal * {
          font-family: 'DM Sans', sans-serif;
          box-sizing: border-box;
        }

        .profile-modal {
          position: absolute;
          right: 1rem;
          top: calc(100% + 3rem);
          width: 320px;
          background: #050505;
          border-radius: 24px;
          border: 1px solid rgba(6, 182, 212, 0.15);
          padding: 0;
          z-index: 50;
          overflow: hidden;
          box-shadow:
            0 0 0 1px rgba(6, 182, 212, 0.08),
            0 24px 60px rgba(0, 0, 0, 0.8),
            0 0 80px rgba(6, 182, 212, 0.04);
          animation: modalDrop 0.25s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }

        @keyframes modalDrop {
          from {
            opacity: 0;
            transform: translateY(-12px) scale(0.96);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        /* Glow strip at top */
        .profile-modal::before {
          content: '';
          position: absolute;
          top: 0;
          left: 50%;
          transform: translateX(-50%);
          width: 60%;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(6, 182, 212, 0.7), transparent);
        }

        /* HEADER */
        .pm-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 20px 22px 16px;
        }

        .pm-title {
          font-family: 'Syne', sans-serif;
          font-weight: 800;
          font-size: 15px;
          color: #fff;
          letter-spacing: 0.06em;
          text-transform: uppercase;
        }

        .pm-close {
          width: 32px;
          height: 32px;
          border-radius: 10px;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.07);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.18s ease;
          color: #666;
        }
        .pm-close:hover {
          background: rgba(6, 182, 212, 0.1);
          border-color: rgba(6, 182, 212, 0.3);
          color: rgb(6, 182, 212);
        }

        /* AVATAR SECTION */
        .pm-hero {
          padding: 0 22px 20px;
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .pm-avatar-wrap {
          position: relative;
          flex-shrink: 0;
        }

        .pm-avatar {
          width: 60px;
          height: 60px;
          border-radius: 18px;
          background: linear-gradient(135deg, #0891b2, #06b6d4, #22d3ee);
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          box-shadow: 0 0 24px rgba(6, 182, 212, 0.35), 0 0 0 1px rgba(6, 182, 212, 0.25);
        }

        .pm-avatar-dot {
          position: absolute;
          bottom: -2px;
          right: -2px;
          width: 14px;
          height: 14px;
          background: #22c55e;
          border-radius: 50%;
          border: 2.5px solid #050505;
          box-shadow: 0 0 8px rgba(34, 197, 94, 0.5);
        }

        .pm-user-name {
          font-family: 'Syne', sans-serif;
          font-size: 17px;
          font-weight: 700;
          color: #fff;
          letter-spacing: -0.01em;
          line-height: 1.2;
        }

        .pm-user-email {
          font-size: 12.5px;
          color: #555;
          margin-top: 3px;
          font-weight: 400;
        }

        /* DIVIDER */
        .pm-divider {
          height: 1px;
          margin: 0 22px;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.06), transparent);
        }

        /* MENU ITEMS */
        .pm-menu {
          padding: 12px 12px;
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .pm-menu-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 11px 12px;
          border-radius: 14px;
          cursor: pointer;
          transition: all 0.16s ease;
          color: #888;
          border: 1px solid transparent;
          text-decoration: none;
        }

        .pm-menu-item:hover {
          background: rgba(6, 182, 212, 0.06);
          border-color: rgba(6, 182, 212, 0.12);
          color: rgb(6, 182, 212);
        }

        .pm-menu-item:hover .pm-menu-icon {
          color: rgb(6, 182, 212);
          background: rgba(6, 182, 212, 0.12);
        }

        .pm-menu-icon {
          width: 34px;
          height: 34px;
          border-radius: 10px;
          background: rgba(255,255,255,0.04);
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.16s ease;
          flex-shrink: 0;
        }

        .pm-menu-label {
          flex: 1;
          font-size: 13.5px;
          font-weight: 500;
          letter-spacing: 0.01em;
        }

        .pm-menu-arrow {
          opacity: 0;
          transform: translateX(-4px);
          transition: all 0.16s ease;
        }
        .pm-menu-item:hover .pm-menu-arrow {
          opacity: 1;
          transform: translateX(0);
        }

        /* BADGE */
        .pm-badge {
          font-size: 10px;
          font-weight: 700;
          padding: 2px 7px;
          border-radius: 20px;
          background: rgba(6, 182, 212, 0.15);
          color: rgb(6, 182, 212);
          border: 1px solid rgba(6, 182, 212, 0.25);
          letter-spacing: 0.04em;
        }

        /* FOOTER / LOGOUT */
        .pm-footer {
          padding: 12px;
          padding-top: 8px;
        }

        .pm-logout {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          padding: 13px;
          border-radius: 16px;
          background: rgba(239, 68, 68, 0.07);
          border: 1px solid rgba(239, 68, 68, 0.15);
          color: #ef4444;
          font-size: 13.5px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.18s ease;
          letter-spacing: 0.02em;
        }

        .pm-logout:hover {
          background: rgba(239, 68, 68, 0.14);
          border-color: rgba(239, 68, 68, 0.35);
          box-shadow: 0 0 24px rgba(239, 68, 68, 0.12);
          transform: translateY(-1px);
        }
        .pm-logout:active {
          transform: translateY(0);
        }
      `}</style>

      <div className="profile-modal">
        {/* HEADER */}
        <div className="pm-header">
          <span className="pm-title">Conta</span>
          <button className="pm-close" onClick={onClose}>
            <X size={19 } />
          </button>
        </div>

        {/* HERO */}
        <div className="pm-hero">
          <div className="pm-avatar-wrap">
            <div className="pm-avatar">
              <User size={26} color="#fff" />
            </div>
            <div className="pm-avatar-dot" />
          </div>
          <div>
            <div className="pm-user-name">{user?.nome || "Guest"}</div>
            <div className="pm-user-email">{user?.email || "guest@email.com"}</div>
          </div>
        </div>

        <div className="pm-divider" />

        {/* MENU */}
        <div className="pm-menu">
          <div className="pm-menu-item">
            <div className="pm-menu-icon">
              <User size={15} />
            </div>
            <span className="pm-menu-label">Perfil</span>
            <ChevronRight size={14} className="pm-menu-arrow" />
          </div>

          <div className="pm-menu-item">
            <div className="pm-menu-icon">
              <Mail size={15} />
            </div>
            <span className="pm-menu-label">Notificações</span>
            <span className="pm-badge">3</span>
            <ChevronRight size={14} className="pm-menu-arrow" />
          </div>

          <div className="pm-menu-item">
            <div className="pm-menu-icon">
              <Shield size={15} />
            </div>
            <span className="pm-menu-label">Segurança</span>
            <ChevronRight size={14} className="pm-menu-arrow" />
          </div>

          <div className="pm-menu-item">
            <div className="pm-menu-icon">
              <Settings size={15} />
            </div>
            <span className="pm-menu-label">Definições</span>
            <ChevronRight size={14} className="pm-menu-arrow" />
          </div>
        </div>

        {/* FOOTER */}
        <div className="pm-footer">
          <button
            className="pm-logout"
            onClick={() => {
              onClose();
              navigate("/Dashboard");
            }}
          >
            <LogOut size={15} />
            Terminar Sessão
          </button>
        </div>
      </div>
    </>
  );
}   