import { useEffect, useState } from "react";
import { styled } from "../styles/stitches.config";
import {
  getSecoes, createSecao, deleteSecao,
  getTarefas, createTarefa, updateTarefa, deleteTarefa,
  updateDia, updateSecao
} from "../api/api";

const Container = styled("div", {
  maxWidth: 480,
  margin: "0 auto",
  padding: "$md"
});
const SecaoCard = styled("div", {
  background: "$surface",
  padding: "$sm",
  borderRadius: "$md",
  marginBottom: "$sm"
});
const TituloSecao = styled("div", {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between"
});
const TaskList = styled("ul", {
  listStyle: "none",
  paddingLeft: 0,
  margin: 0
});
const TaskItem = styled("li", {
  display: "flex",
  alignItems: "center",
  padding: "4px 0"
});
const Checkbox = styled("input", {
  marginRight: 8,
  width: 18,
  height: 18
});
const AddInput = styled("input", {
  background: "$surface",
  color: "$text",
  padding: "$xs",
  border: "1px solid $muted",
  borderRadius: "$sm",
  marginRight: "$xs",
  width: "100%"
});
const Button = styled("button", {
  background: "$primary",
  color: "#18181b",
  border: "none",
  borderRadius: "$sm",
  padding: "$xs $sm",
  cursor: "pointer",
  fontWeight: "bold",
  marginLeft: 4
});
const DeleteButton = styled("button", {
  background: "$danger",
  color: "#fff",
  border: "none",
  borderRadius: "$sm",
  padding: "2px 7px",
  marginLeft: 8,
  cursor: "pointer"
});
const Editable = styled("input", {
  background: "$surface",
  color: "$text",
  fontSize: 16,
  border: "1px solid $muted",
  borderRadius: "$sm",
  padding: "2px 4px",
  margin: "0 2px",
  width: "auto"
});

export function DiaDetalhe({ dia, onBack }) {
  // Estados para dados e edição
  const [secoes, setSecoes] = useState([]);
  const [tarefasPorSecao, setTarefasPorSecao] = useState({});
  const [novaSecao, setNovaSecao] = useState("");
  const [novoEmoji, setNovoEmoji] = useState("🔸");
  const [novaCor, setNovaCor] = useState("#22c55e");
  const [novaTarefaTexto, setNovaTarefaTexto] = useState({});

  // Edição inline Dia
  const [editDia, setEditDia] = useState(false);
  const [diaData, setDiaData] = useState(dia.data);
  const [diaTitulo, setDiaTitulo] = useState(dia.titulo);
  const [diaEmoji, setDiaEmoji] = useState(dia.emoji);

  // Edição inline Seção
  const [editSecaoId, setEditSecaoId] = useState(null);
  const [editSecaoNome, setEditSecaoNome] = useState("");
  const [editSecaoEmoji, setEditSecaoEmoji] = useState("");
  const [editSecaoCor, setEditSecaoCor] = useState("");

  // Edição inline Tarefa
  const [editTarefaId, setEditTarefaId] = useState(null);
  const [editTarefaTexto, setEditTarefaTexto] = useState("");

  useEffect(() => {
    loadSecoes();
    // eslint-disable-next-line
  }, [dia.id]);

  // Carrega as seções e tarefas
  async function loadSecoes() {
    const secoesList = await getSecoes(dia.id);
    setSecoes(secoesList);
    for (const secao of secoesList) {
      await loadTarefas(secao.id);
    }
  }
  async function loadTarefas(secao_id) {
    const tarefas = await getTarefas(secao_id);
    setTarefasPorSecao(prev => ({ ...prev, [secao_id]: tarefas }));
  }

  // CRUD de seções
  async function handleAddSecao() {
    if (!novaSecao) return;
    await createSecao({
      dia_id: dia.id,
      nome: novaSecao,
      emoji: novoEmoji,
      cor: novaCor
    });
    setNovaSecao("");
    setNovoEmoji("🔸");
    setNovaCor("#22c55e");
    loadSecoes();
  }
  async function handleDeleteSecao(id) {
    if (confirm("Deletar esta seção?")) {
      await deleteSecao(id);
      loadSecoes();
    }
  }
  async function handleSaveSecao(secao) {
    await updateSecao(secao.id, {
      nome: editSecaoNome,
      emoji: editSecaoEmoji,
      cor: editSecaoCor
    });
    setEditSecaoId(null);
    loadSecoes();
  }

  // CRUD de tarefas
  async function handleAddTarefa(secao_id) {
    const texto = (novaTarefaTexto[secao_id] || "").trim();
    if (!texto) return;
    await createTarefa({
      secao_id,
      texto,
      feito: false,
      tipo: "checkbox"
    });
    setNovaTarefaTexto(prev => ({ ...prev, [secao_id]: "" }));
    await loadTarefas(secao_id);
  }
  async function handleToggleTarefa(tarefa) {
    await updateTarefa(tarefa.id, {
      texto: tarefa.texto,
      feito: !tarefa.feito,
      tipo: tarefa.tipo,
      ordem: tarefa.ordem
    });
    await loadTarefas(tarefa.secao_id);
  }
  async function handleDeleteTarefa(tarefa) {
    if (confirm("Deletar esta tarefa?")) {
      await deleteTarefa(tarefa.id);
      await loadTarefas(tarefa.secao_id);
    }
  }
  async function handleSaveTarefa(tarefa) {
    await updateTarefa(tarefa.id, {
      texto: editTarefaTexto,
      feito: tarefa.feito,
      tipo: tarefa.tipo,
      ordem: tarefa.ordem
    });
    setEditTarefaId(null);
    await loadTarefas(tarefa.secao_id);
  }

  // CRUD Dia (edição inline)
  async function handleUpdateDia() {
    await updateDia(dia.id, { data: diaData, titulo: diaTitulo, emoji: diaEmoji, capa_url: dia.capa_url });
    setEditDia(false);
    // Atualiza estados para refletir o novo dia
    // (Opcional, caso queira atualizar na hora)
    // setDiaTitulo(diaTitulo);
    // setDiaEmoji(diaEmoji);
    // setDiaData(diaData);
  }

  return (
    <Container>
      <Button onClick={onBack}>⬅️ Voltar</Button>

      {/* Título, emoji e data do dia (editável) */}
      <div style={{ textAlign: "center", marginBottom: 16 }}>
        {editDia ? (
          <div>
            <Editable
              style={{ width: 40, fontSize: 24 }}
              type="text"
              maxLength={2}
              value={diaEmoji}
              onChange={e => setDiaEmoji(e.target.value)}
            />
            <Editable
              type="text"
              value={diaTitulo}
              onChange={e => setDiaTitulo(e.target.value)}
            />
            <Editable
              type="date"
              style={{ fontSize: 18 }}
              value={diaData}
              onChange={e => setDiaData(e.target.value)}
            />
            <Button onClick={handleUpdateDia}>Salvar</Button>
            <Button onClick={() => setEditDia(false)}>Cancelar</Button>
          </div>
        ) : (
          <span style={{ cursor: "pointer" }} onClick={() => setEditDia(true)}>
            <span style={{ fontSize: 24 }}>{diaEmoji}</span> {diaTitulo} <span style={{ color: "#888" }}>{new Date(diaData).toLocaleDateString("pt-BR")}</span>
            <span style={{ marginLeft: 12, fontSize: 18, color: "#2dd4bf" }}>✏️</span>
          </span>
        )}
      </div>

      {/* Inputs para adicionar nova seção */}
      <div style={{ display: "flex", marginBottom: 16 }}>
        <AddInput
          type="text"
          placeholder="Nome da Seção"
          value={novaSecao}
          onChange={e => setNovaSecao(e.target.value)}
        />
        <AddInput
          type="text"
          maxLength={2}
          style={{ width: 40 }}
          value={novoEmoji}
          onChange={e => setNovoEmoji(e.target.value)}
        />
        <AddInput
          type="color"
          style={{ width: 40, padding: 0 }}
          value={novaCor}
          onChange={e => setNovaCor(e.target.value)}
        />
        <Button onClick={handleAddSecao}>+</Button>
      </div>

      {/* Listagem de seções e tarefas */}
      {secoes.length === 0 && <p>Nenhuma seção cadastrada.</p>}
      {secoes.map(secao => (
        <SecaoCard key={secao.id} style={{ borderLeft: `8px solid ${secao.cor || "#22c55e"}`, marginBottom: 32 }}>
          <TituloSecao>
            {/* Edição inline de seção */}
            {editSecaoId === secao.id ? (
              <span>
                <Editable
                  style={{ width: 40, fontSize: 20 }}
                  type="text"
                  maxLength={2}
                  value={editSecaoEmoji}
                  onChange={e => setEditSecaoEmoji(e.target.value)}
                />
                <Editable
                  type="text"
                  value={editSecaoNome}
                  onChange={e => setEditSecaoNome(e.target.value)}
                />
                <Editable
                  type="color"
                  style={{ width: 32 }}
                  value={editSecaoCor}
                  onChange={e => setEditSecaoCor(e.target.value)}
                />
                <Button onClick={() => handleSaveSecao(secao)}>Salvar</Button>
                <Button onClick={() => setEditSecaoId(null)}>Cancelar</Button>
              </span>
            ) : (
              <span style={{ cursor: "pointer" }} onClick={() => {
                setEditSecaoId(secao.id);
                setEditSecaoNome(secao.nome);
                setEditSecaoEmoji(secao.emoji);
                setEditSecaoCor(secao.cor);
              }}>
                <span style={{ fontSize: 22, marginRight: 8 }}>{secao.emoji}</span>
                {secao.nome}
                <span style={{ marginLeft: 8, fontSize: 16, color: "#2dd4bf" }}>✏️</span>
              </span>
            )}
            <DeleteButton onClick={() => handleDeleteSecao(secao.id)}>🗑️</DeleteButton>
          </TituloSecao>

          {/* Lista de tarefas dessa seção */}
          <TaskList>
            {(tarefasPorSecao[secao.id] || []).map(tarefa => (
              <TaskItem key={tarefa.id}>
                <Checkbox
                  type="checkbox"
                  checked={!!tarefa.feito}
                  onChange={() => handleToggleTarefa(tarefa)}
                />
                {editTarefaId === tarefa.id ? (
                  <>
                    <Editable
                      style={{ fontSize: 16 }}
                      type="text"
                      value={editTarefaTexto}
                      onChange={e => setEditTarefaTexto(e.target.value)}
                      onKeyDown={e => { if (e.key === "Enter") handleSaveTarefa(tarefa); }}
                    />
                    <Button onClick={() => handleSaveTarefa(tarefa)}>Salvar</Button>
                    <Button onClick={() => setEditTarefaId(null)}>Cancelar</Button>
                  </>
                ) : (
                  <span
                    style={{
                      textDecoration: tarefa.feito ? "line-through" : "none",
                      color: tarefa.feito ? "#22c55e" : "#e2e8f0",
                      fontWeight: tarefa.feito ? 500 : 400,
                      fontSize: 16,
                      cursor: "pointer"
                    }}
                    onClick={() => {
                      setEditTarefaId(tarefa.id);
                      setEditTarefaTexto(tarefa.texto);
                    }}
                  >
                    {tarefa.texto}
                    <span style={{ marginLeft: 8, fontSize: 14, color: "#2dd4bf" }}>✏️</span>
                  </span>
                )}
                <DeleteButton onClick={() => handleDeleteTarefa(tarefa)}>✖</DeleteButton>
              </TaskItem>
            ))}
            {/* Adicionar nova tarefa */}
            <TaskItem>
              <AddInput
                type="text"
                placeholder="Nova tarefa"
                value={novaTarefaTexto[secao.id] || ""}
                onChange={e => setNovaTarefaTexto(prev => ({ ...prev, [secao.id]: e.target.value }))}
                onKeyDown={e => { if (e.key === "Enter") handleAddTarefa(secao.id); }}
              />
              <Button onClick={() => handleAddTarefa(secao.id)}>Adicionar</Button>
            </TaskItem>
          </TaskList>
        </SecaoCard>
      ))}
    </Container>
  );
}
