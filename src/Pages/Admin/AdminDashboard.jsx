import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import DashBoardHeader from "/src/Components/Header/HeaderDashBoard";
import SideBar from "/src/Components/SideBar/SideBar";
import adminBackground from "/src/assets/AdminBackground.png";

import {
  getAdminAlunoDetalhes,
  getAdminAlunos,
  getAdminConteudo,
  getAdminDashboard,
  updateAdminAlunoAtivo,
  updateAdminAlunoCoins,
} from "/src/Services/admin/adminService.js";

import "/src/Pages/Admin/AdminDashboard.css";

const TABS = {
  GERAL: "geral",
  ALUNOS: "alunos",
  CONTEUDO: "conteudo",
};

function formatarTempo(valor) {
  const total = Number(valor || 0);

  if (!total || Number.isNaN(total)) {
    return "0 min";
  }

  const horas = Math.floor(total / 3600);
  const minutos = Math.floor((total % 3600) / 60);

  if (horas <= 0) {
    return `${minutos} min`;
  }

  return `${horas}h ${minutos}min`;
}

function obterTexto(item, campos, fallback = "Sem nome") {
  for (const campo of campos) {
    if (
      item &&
      item[campo] !== undefined &&
      item[campo] !== null &&
      item[campo] !== ""
    ) {
      return item[campo];
    }
  }

  return fallback;
}

function StatCard({ titulo, valor, descricao }) {
  return (
    <article className="admin-stat-card">
      <span>{titulo}</span>
      <strong>{valor}</strong>
      {descricao ? <p>{descricao}</p> : null}
    </article>
  );
}

function ConteudoCard({ titulo, items }) {
  const lista = Array.isArray(items) ? items : [];

  return (
    <article className="admin-content-card">
      <div className="admin-content-card-top">
        <h3>{titulo}</h3>
        <strong>{lista.length}</strong>
      </div>

      {lista.length > 0 ? (
        <ul>
          {lista.slice(0, 8).map((item, index) => (
            <li key={item.id || index}>
              {obterTexto(item, ["nome", "titulo", "descricao", "id"])}
            </li>
          ))}
        </ul>
      ) : (
        <p>Sem registos.</p>
      )}
    </article>
  );
}

function AdminShell({ user, children }) {
  return (
    <div
      className="admin-shell"
      style={{
        "--admin-bg-image": `url(${adminBackground})`,
      }}
    >
      <DashBoardHeader user={user} />
      <SideBar user={user} />

      {children}
    </div>
  );
}

export default function AdminDashboard() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);

  const [tabAtiva, setTabAtiva] = useState(TABS.GERAL);
  const [dashboard, setDashboard] = useState({});
  const [alunos, setAlunos] = useState([]);
  const [conteudo, setConteudo] = useState({});
  const [pesquisa, setPesquisa] = useState("");
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");
  const [alunoSelecionado, setAlunoSelecionado] = useState(null);
  const [loadingAluno, setLoadingAluno] = useState(false);

  const [alunoCoins, setAlunoCoins] = useState(null);
  const [coinsInput, setCoinsInput] = useState(0);
  const [savingCoins, setSavingCoins] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem("cq_user");

    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Erro ao carregar utilizador do localStorage:", error);
      }
    }
  }, []);

  async function carregarDados() {
    try {
      setLoading(true);
      setErro("");

      const [dashboardData, alunosData, conteudoData] = await Promise.all([
        getAdminDashboard(),
        getAdminAlunos(),
        getAdminConteudo(),
      ]);

      setDashboard(dashboardData || {});
      setAlunos(Array.isArray(alunosData) ? alunosData : []);
      setConteudo(conteudoData || {});
    } catch (error) {
      const mensagem =
        error?.response?.data?.message ||
        "Não foi possível carregar o painel de administração.";

      setErro(mensagem);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    carregarDados();
  }, []);

  const alunosFiltrados = useMemo(() => {
    const termo = pesquisa.trim().toLowerCase();

    if (!termo) {
      return alunos;
    }

    return alunos.filter((aluno) => {
      const texto = `
        ${aluno.nome || ""}
        ${aluno.email || ""}
        ${aluno.turma || ""}
        ${aluno.ano || ""}
        ${aluno.escola || ""}
      `.toLowerCase();

      return texto.includes(termo);
    });
  }, [alunos, pesquisa]);

  async function abrirDetalhesAluno(id) {
    try {
      setLoadingAluno(true);

      const detalhes = await getAdminAlunoDetalhes(id);
      setAlunoSelecionado(detalhes);
    } catch (error) {
      alert(
        error?.response?.data?.message ||
          "Erro ao carregar detalhes do aluno."
      );
    } finally {
      setLoadingAluno(false);
    }
  }

  async function alterarEstadoAluno(aluno) {
    if (!aluno || !aluno.id) {
      alert("Aluno inválido.");
      return;
    }

    const estadoAtual = aluno.ativo === true;
    const novoEstado = !estadoAtual;
    const acao = novoEstado ? "ativar" : "desativar";

    const confirmar = window.confirm(
      `Tens a certeza que queres ${acao} o aluno "${
        aluno.nome || "sem nome"
      }"?`
    );

    if (!confirmar) {
      return;
    }

    try {
      await updateAdminAlunoAtivo(aluno.id, novoEstado);

      setAlunos((listaAtual) =>
        listaAtual.map((item) => {
          if (item.id === aluno.id) {
            return {
              ...item,
              ativo: novoEstado,
            };
          }

          return item;
        })
      );

      if (
        alunoSelecionado &&
        alunoSelecionado.aluno &&
        alunoSelecionado.aluno.id === aluno.id
      ) {
        setAlunoSelecionado((atual) => ({
          ...atual,
          aluno: {
            ...atual.aluno,
            ativo: novoEstado,
          },
        }));
      }
    } catch (error) {
      alert(
        error?.response?.data?.message ||
          "Erro ao atualizar o estado do aluno."
      );
    }
  }

  function abrirEditorCoins(aluno) {
    if (!aluno || !aluno.id) {
      alert("Aluno inválido.");
      return;
    }

    setAlunoCoins(aluno);
    setCoinsInput(Number(aluno.coins || 0));
  }

  async function guardarCoins() {
    if (!alunoCoins || !alunoCoins.id) {
      alert("Aluno inválido.");
      return;
    }

    const novasCoins = Number(coinsInput);

    if (Number.isNaN(novasCoins)) {
      alert("As coins têm de ser um número válido.");
      return;
    }

    if (novasCoins < 0) {
      alert("As coins não podem ser negativas.");
      return;
    }

    try {
      setSavingCoins(true);

      await updateAdminAlunoCoins(alunoCoins.id, novasCoins);

      setAlunos((listaAtual) =>
        listaAtual.map((item) => {
          if (item.id === alunoCoins.id) {
            return {
              ...item,
              coins: novasCoins,
            };
          }

          return item;
        })
      );

      if (
        alunoSelecionado &&
        alunoSelecionado.aluno &&
        alunoSelecionado.aluno.id === alunoCoins.id
      ) {
        setAlunoSelecionado((atual) => ({
          ...atual,
          aluno: {
            ...atual.aluno,
            coins: novasCoins,
          },
        }));
      }

      setAlunoCoins(null);
    } catch (error) {
      alert(
        error?.response?.data?.message || "Erro ao atualizar coins do aluno."
      );
    } finally {
      setSavingCoins(false);
    }
  }

  if (loading) {
    return (
      <AdminShell user={user}>
        <main className="admin-page">
          <section className="admin-loading-card">
            <div className="admin-loader"></div>
            <h1>A carregar painel de administração...</h1>
            <p>Estamos a preparar os dados dos alunos e do jogo.</p>
          </section>
        </main>
      </AdminShell>
    );
  }

  if (erro) {
    return (
      <AdminShell user={user}>
        <main className="admin-page">
          <section className="admin-error-card">
            <h1>Erro no painel de administração</h1>
            <p>{erro}</p>

            <div className="admin-error-actions">
              <button type="button" onClick={carregarDados}>
                Tentar novamente
              </button>

              <button
                type="button"
                className="secondary"
                onClick={() => navigate("/Dashboard")}
              >
                Voltar ao dashboard
              </button>
            </div>
          </section>
        </main>
      </AdminShell>
    );
  }

  return (
    <AdminShell user={user}>
      <main className="admin-page">
        <header className="admin-header">
          <div>
            <span className="admin-label">CodeQuestPOO</span>
            <h1>Painel de Administração</h1>
            <p>
              Gere alunos, acompanha estatísticas, consulta progresso, altera
              coins e controla o conteúdo principal da plataforma.
            </p>
          </div>

          <div className="admin-header-actions">
            <button
              type="button"
              className="admin-refresh-btn"
              onClick={carregarDados}
            >
              Atualizar
            </button>

            <button
              type="button"
              className="admin-back-btn"
              onClick={() => navigate("/Dashboard")}
            >
              Voltar
            </button>
          </div>
        </header>

        <nav className="admin-tabs">
          <button
            type="button"
            className={tabAtiva === TABS.GERAL ? "active" : ""}
            onClick={() => setTabAtiva(TABS.GERAL)}
          >
            Visão geral
          </button>

          <button
            type="button"
            className={tabAtiva === TABS.ALUNOS ? "active" : ""}
            onClick={() => setTabAtiva(TABS.ALUNOS)}
          >
            Alunos
          </button>

          <button
            type="button"
            className={tabAtiva === TABS.CONTEUDO ? "active" : ""}
            onClick={() => setTabAtiva(TABS.CONTEUDO)}
          >
            Conteúdo
          </button>
        </nav>

        {tabAtiva === TABS.GERAL ? (
          <section className="admin-section">
            <div className="admin-stats-grid">
              <StatCard
                titulo="Total de alunos"
                valor={dashboard.totalAlunos || 0}
                descricao="Contas registadas"
              />

              <StatCard
                titulo="Alunos ativos"
                valor={dashboard.alunosAtivos || 0}
                descricao="Podem entrar no jogo"
              />

              <StatCard
                titulo="Alunos inativos"
                valor={dashboard.alunosInativos || 0}
                descricao="Contas bloqueadas"
              />

              <StatCard
                titulo="Desafios concluídos"
                valor={dashboard.totalDesafiosConcluidos || 0}
                descricao="Registos de conclusão"
              />

              <StatCard
                titulo="Erros registados"
                valor={dashboard.totalErros || 0}
                descricao="Erros dos alunos"
              />

              <StatCard
                titulo="Tempo total jogado"
                valor={formatarTempo(dashboard.tempoTotal)}
                descricao="Soma geral dos alunos"
              />
            </div>

            <div className="admin-overview-grid">
              <article className="admin-panel">
                <div className="admin-panel-title">
                  <h2>Melhor registo</h2>
                  <span>Leaderboard</span>
                </div>

                {dashboard.melhorRegisto ? (
                  <div className="admin-best-box">
                    <div className="admin-best-avatar">
                      {(dashboard.melhorRegisto.aluno?.nome || "?").charAt(0)}
                    </div>

                    <div>
                      <strong>
                        {dashboard.melhorRegisto.aluno?.nome ||
                          "Aluno sem nome"}
                      </strong>

                      <p>
                        Tempo:{" "}
                        {formatarTempo(dashboard.melhorRegisto.tempo_desafio)}
                      </p>

                      <p>
                        Desafio ID:{" "}
                        {dashboard.melhorRegisto.desafio_id || "Não definido"}
                      </p>
                    </div>
                  </div>
                ) : (
                  <p className="admin-muted">
                    Ainda não existem desempenhos registados.
                  </p>
                )}
              </article>

              <article className="admin-panel">
                <div className="admin-panel-title">
                  <h2>Resumo do conteúdo</h2>
                  <span>Jogo</span>
                </div>

                <div className="admin-mini-grid">
                  <div>
                    <span>Mapas</span>
                    <strong>{dashboard.conteudo?.totalMapas || 0}</strong>
                  </div>

                  <div>
                    <span>Níveis</span>
                    <strong>{dashboard.conteudo?.totalNiveis || 0}</strong>
                  </div>

                  <div>
                    <span>Desafios</span>
                    <strong>{dashboard.conteudo?.totalDesafios || 0}</strong>
                  </div>

                  <div>
                    <span>Troféus</span>
                    <strong>{dashboard.conteudo?.totalTrofeus || 0}</strong>
                  </div>

                  <div>
                    <span>Achievements</span>
                    <strong>
                      {dashboard.conteudo?.totalAchievements || 0}
                    </strong>
                  </div>

                  <div>
                    <span>Missões</span>
                    <strong>{dashboard.conteudo?.totalMissoes || 0}</strong>
                  </div>
                </div>
              </article>
            </div>
          </section>
        ) : null}

        {tabAtiva === TABS.ALUNOS ? (
          <section className="admin-section">
            <div className="admin-section-header">
              <div>
                <h2>Gestão de alunos</h2>
                <p>
                  Pesquisa alunos, vê estatísticas, altera coins e ativa ou
                  desativa contas.
                </p>
              </div>

              <input
                className="admin-search"
                type="text"
                placeholder="Pesquisar por nome, email, turma ou escola..."
                value={pesquisa}
                onChange={(event) => setPesquisa(event.target.value)}
              />
            </div>

            <div className="admin-table-card">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Aluno</th>
                    <th>Email</th>
                    <th>Turma</th>
                    <th>Ano</th>
                    <th>Escola</th>
                    <th>Coins</th>
                    <th>Tempo</th>
                    <th>Desafios</th>
                    <th>Erros</th>
                    <th>Estado</th>
                    <th>Ações</th>
                  </tr>
                </thead>

                <tbody>
                  {alunosFiltrados.map((aluno) => (
                    <tr key={aluno.id}>
                      <td>
                        <div className="admin-user-cell">
                          <div className="admin-user-avatar">
                            {(aluno.nome || "?").charAt(0)}
                          </div>

                          <div>
                            <strong>{aluno.nome || "Sem nome"}</strong>
                            <span>ID #{aluno.id}</span>
                          </div>
                        </div>
                      </td>

                      <td>{aluno.email || "—"}</td>
                      <td>{aluno.turma || "—"}</td>
                      <td>{aluno.ano || "—"}</td>
                      <td>{aluno.escola || "—"}</td>

                      <td>
                        <span className="admin-coin-pill">
                          🪙 {Number(aluno.coins || 0)}
                        </span>
                      </td>

                      <td>{formatarTempo(aluno.tempo_total)}</td>
                      <td>{aluno.desafios_concluidos || 0}</td>
                      <td>{aluno.erros_registados || 0}</td>

                      <td>
                        <span
                          className={
                            aluno.ativo
                              ? "admin-status active"
                              : "admin-status inactive"
                          }
                        >
                          {aluno.ativo ? "Ativo" : "Inativo"}
                        </span>
                      </td>

                      <td>
                        <div className="admin-actions">
                          <button
                            type="button"
                            className="view"
                            onClick={() => abrirDetalhesAluno(aluno.id)}
                            disabled={loadingAluno}
                          >
                            Ver
                          </button>

                          <button
                            type="button"
                            className="coins"
                            onClick={() => abrirEditorCoins(aluno)}
                          >
                            Coins
                          </button>

                          <button
                            type="button"
                            className={aluno.ativo ? "danger" : "success"}
                            onClick={() => alterarEstadoAluno(aluno)}
                          >
                            {aluno.ativo ? "Desativar" : "Ativar"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {alunosFiltrados.length === 0 ? (
                <div className="admin-empty">
                  <h3>Nenhum aluno encontrado</h3>
                  <p>Tenta pesquisar por outro nome, email ou turma.</p>
                </div>
              ) : null}
            </div>
          </section>
        ) : null}

        {tabAtiva === TABS.CONTEUDO ? (
          <section className="admin-section">
            <div className="admin-section-header">
              <div>
                <h2>Conteúdo do jogo</h2>
                <p>
                  Consulta os mapas, níveis, desafios, troféus e missões
                  existentes.
                </p>
              </div>
            </div>

            <div className="admin-content-grid">
              <ConteudoCard titulo="Mapas" items={conteudo.mapas} />
              <ConteudoCard titulo="Níveis" items={conteudo.niveis} />
              <ConteudoCard titulo="Desafios" items={conteudo.desafios} />
              <ConteudoCard titulo="Troféus" items={conteudo.trofeus} />
              <ConteudoCard
                titulo="Achievements"
                items={conteudo.achievements}
              />
              <ConteudoCard
                titulo="Missões diárias"
                items={conteudo.missoesDiarias}
              />
            </div>
          </section>
        ) : null}

        {alunoSelecionado ? (
          <div
            className="admin-modal-backdrop"
            onClick={() => setAlunoSelecionado(null)}
          >
            <section
              className="admin-modal"
              onClick={(event) => event.stopPropagation()}
            >
              <button
                type="button"
                className="admin-modal-close"
                onClick={() => setAlunoSelecionado(null)}
              >
                ×
              </button>

              <div className="admin-modal-header">
                <div className="admin-modal-avatar">
                  {(alunoSelecionado.aluno?.nome || "?").charAt(0)}
                </div>

                <div>
                  <h2>{alunoSelecionado.aluno?.nome || "Aluno"}</h2>
                  <p>{alunoSelecionado.aluno?.email || "Sem email"}</p>
                </div>
              </div>

              <div className="admin-modal-info-grid">
                <div>
                  <span>Turma</span>
                  <strong>{alunoSelecionado.aluno?.turma || "—"}</strong>
                </div>

                <div>
                  <span>Ano</span>
                  <strong>{alunoSelecionado.aluno?.ano || "—"}</strong>
                </div>

                <div>
                  <span>Escola</span>
                  <strong>{alunoSelecionado.aluno?.escola || "—"}</strong>
                </div>

                <div>
                  <span>Estado</span>
                  <strong>
                    {alunoSelecionado.aluno?.ativo ? "Ativo" : "Inativo"}
                  </strong>
                </div>

                <div>
                  <span>Coins</span>
                  <strong>
                    🪙 {Number(alunoSelecionado.aluno?.coins || 0)}
                  </strong>
                </div>

                <div>
                  <span>Tempo total</span>
                  <strong>
                    {formatarTempo(alunoSelecionado.tempo?.tempo_total)}
                  </strong>
                </div>

                <div>
                  <span>Tempo semanal</span>
                  <strong>
                    {formatarTempo(alunoSelecionado.tempo?.horas_semana)}
                  </strong>
                </div>
              </div>

              <div className="admin-modal-columns">
                <article>
                  <h3>Últimos desempenhos</h3>

                  {alunoSelecionado.desempenhos?.length > 0 ? (
                    alunoSelecionado.desempenhos
                      .slice(0, 6)
                      .map((item, index) => (
                        <div
                          className="admin-modal-list-item"
                          key={item.id || index}
                        >
                          <strong>Desafio {item.desafio_id || "—"}</strong>
                          <span>Tempo: {formatarTempo(item.tempo_desafio)}</span>
                        </div>
                      ))
                  ) : (
                    <p className="admin-muted">Sem desempenhos registados.</p>
                  )}
                </article>

                <article>
                  <h3>Últimos erros</h3>

                  {alunoSelecionado.erros?.length > 0 ? (
                    alunoSelecionado.erros.slice(0, 6).map((item, index) => (
                      <div
                        className="admin-modal-list-item"
                        key={item.id || index}
                      >
                        <strong>
                          {obterTexto(item, [
                            "descricao",
                            "erro",
                            "mensagem",
                            "tipo_erro_id",
                          ])}
                        </strong>

                        <span>Desafio: {item.desafio_id || "—"}</span>
                      </div>
                    ))
                  ) : (
                    <p className="admin-muted">Sem erros registados.</p>
                  )}
                </article>
              </div>
            </section>
          </div>
        ) : null}

        {alunoCoins ? (
          <div
            className="admin-modal-backdrop"
            onClick={() => setAlunoCoins(null)}
          >
            <section
              className="admin-coins-modal"
              onClick={(event) => event.stopPropagation()}
            >
              <button
                type="button"
                className="admin-modal-close"
                onClick={() => setAlunoCoins(null)}
              >
                ×
              </button>

              <div className="admin-coins-header">
                <div className="admin-modal-avatar">
                  {(alunoCoins.nome || "?").charAt(0)}
                </div>

                <div>
                  <h2>Editar coins</h2>
                  <p>{alunoCoins.nome || "Aluno sem nome"}</p>
                </div>
              </div>

              <div className="admin-coins-form">
                <label>
                  <span>🪙 Coins</span>
                  <input
                    type="number"
                    min="0"
                    value={coinsInput}
                    onChange={(event) => setCoinsInput(event.target.value)}
                  />
                </label>
              </div>

              <div className="admin-coins-actions">
                <button
                  type="button"
                  className="admin-back-btn"
                  onClick={() => setAlunoCoins(null)}
                >
                  Cancelar
                </button>

                <button
                  type="button"
                  className="admin-refresh-btn"
                  onClick={guardarCoins}
                  disabled={savingCoins}
                >
                  {savingCoins ? "A guardar..." : "Guardar coins"}
                </button>
              </div>
            </section>
          </div>
        ) : null}
      </main>
    </AdminShell>
  );
}