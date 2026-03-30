import { LogOut, User, X, Mail, Shield, ChevronRight, Settings } from "lucide-react";
import { pararTempo } from "../../Services/tempoService";
import { useNavigate } from "react-router-dom";
import "../../css/ProfileModal.css";


export default function ProfileModal({ user, onClose }) {
  const navigate = useNavigate();

  return (
    <>

      <div className="profile-modal">
        {/* HEADER */}
        <div className="pm-header">
          <span className="pm-title">Conta</span>
          <button className="pm-close" onClick={onClose}>
            <X size={19} />
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
            <button className="pm-menu-label" onClick={() => navigate("/Perfil")}>
              Perfil
            </button>
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
              pararTempo();
              localStorage.removeItem("cq_token");
              localStorage.removeItem("cq_user");

              onClose();
              navigate("/", { replace: true });
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