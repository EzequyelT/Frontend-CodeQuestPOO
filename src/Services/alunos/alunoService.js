// This compatibility shim avoids 404 for old code paths
// and forwards to the new centralized UserService.

import {
  registerUser,
  getAllAlunos,
  login,
  register,
  saveToken,
  getToken,
  logout,
  isAuthenticated,
  getProgresso,
  getProgressoDashboard,
  iniciarTempo,
  pararTempo,
} from "../UserService";

export {
  registerUser,
  getAllAlunos,
  login,
  register,
  saveToken,
  getToken,
  logout,
  isAuthenticated,
  getProgresso,
  getProgressoDashboard,
  iniciarTempo,
  pararTempo,
};