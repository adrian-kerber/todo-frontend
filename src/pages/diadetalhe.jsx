import { useEffect, useState, useCallback } from "react";
import { styled } from "../styles/stitches.config";
import {
  getSecoes, createSecao, deleteSecao,
  getTarefas, createTarefa, updateTarefa, deleteTarefa,
  updateDia, updateSecao
} from "../api/api";
import { motion, AnimatePresence } from "framer-motion";

// UTILIDADE PARA EVITAR BUG DE TIMEZONE
function toInputDateString(date) {
  if (!date) return "";
  if (typeof date === "string" && date.length >= 10) return date.slice(0, 10);
  return new Date(date).toISOString().slice(0, 10);
}

const Container = styled("div", {
  maxWidth: 540,
  margin: "0 auto",
  padding: "$md"
});
const SecaoCard = styled(motion.div, {
  background: "rgba(35,35,41,0.95)",
  boxShadow: "$glass",
  padding: "$md",
  borderRadius: "$md",
  marginBottom: "$lg",
  backdropFilter: "blur(3px)",
  borderLeft: "8px solid $primary"
});
const TituloSecao = styled("div", {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  fontSize: "$lg",
  marginBottom: "$sm"
});
const TaskList = styled("ul", {
  listStyle: "none",
  paddingLeft: 0,
  margin: 0
});
const TaskItem = styled(motion.li, {
  display: "flex",
  alignItems: "center",
  padding: "8px 0"
});
const Checkbox = styled("input", {
  marginRight: 12,
  width: 22,
  height: 22,
  accentColor: "$primary"
});
const AddInput = styled("input", {
  background: "$surface",
  color: "$text",
  padding: "$xs",
  border: "1px solid $muted",
  borderRadius: "$sm",
  width: "100%",
  marginRight: "$xs",
  fontSize: "18px"
});
const Button = styled("button", {
  background: "$primary",
  color: "#232329",
  border: "none",
  borderRadius: "$md",
  padding: "$xs $md",
  cursor: "pointer",
  fontWeight: "bold",
  marginLeft: 4,
  fontSize: "16px",
  boxShadow: "0 2px 8px #22d3ee33",
  transition: "background .18s",
  "&:hover": {
    background: "$accent"
  }
});
const DeleteButton = styled("button", {
  background: "$danger",
  color: "#fff",
  border: "none",
  borderRadius: "$md",
  padding: "4px 14px",
  marginLeft: 8,
  cursor: "pointer",
  fontSize: "15px",
  fontWeight: "bold",
  boxShadow: "0 1px 4px #ef444455"
});
const Editable = styled("input", {
  background: "$surface",
  color: "$text",
  fontSize: "18px",
  border: "1.5px solid $muted",
  borderRadius: "$sm",
  padding: "2px 6px",
  margin: "0 2px",
  width: "auto"
});
const DiaHeader = styled("div", {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  marginBottom: "$lg"
});

export function DiaDetalhe({ dia, onBack }) {
  const [secoes, setSecoes] = useState([]);
  const [tarefasPorSecao, setTarefasPorSecao] = useState({});
  const [novaSecao, setNovaSecao] = useState("");
  const [novoEmoji, setNovoEmoji] = useState("🔸");
  const [novaCor, setNovaCor] = useState("#22d3ee");
  const [novaTarefaTexto, setNovaTarefaTexto] = useState({});
  const [editDia, setEditDia] = useState(false);
  const [diaData, setDiaData] = useState(dia.data);
  const [diaTitulo, setDiaTitulo] = useState(dia.titulo);
  const [diaEmoji, setDiaEmoji] = useState(dia.emoji);
  const [editSecaoId, setEditSecaoId] = useState(null);
  const [editSecaoNome, setEditSecaoNome] = useState("");
  const [editSecaoEmoji, setEditSecaoEmoji] = useState("");
  const [editSecaoCor, setEditSecaoCor] = useState("");
  const [editTarefaId, setEditTarefaId] = useState(null);
  const [editTarefaTexto, setEditTarefaTexto] = useState("");

  const loadSecoes = useCallback(async () => {
    const secoesList = await getSecoes(dia.id);
    setSecoes(secoesList);
    for (const secao of secoesList) {
      await loadTarefas(secao.id);
    }
  }, [dia.id]);

  useEffect(() => {
    loadSecoes();
  }, [loadSecoes]);

  async function loadTarefas(secao_id) {
    const tarefas = await getTarefas(secao_id);
    setTarefasPorSecao(prev => ({ ...prev, [secao_id]: tarefas }));
  }
  async function handleAddSecao() {
    if (!novaSecao) return;
    await createSecao({ dia_id: dia.id, nome: novaSecao, emoji: novoEmoji, cor: novaCor });
    setNovaSecao(""); setNovoEmoji("🔸"); setNovaCor("#22d3ee"); 
    await loadSecoes();
  }
  async function handleDeleteSecao(id) { 
    if (confirm("Deletar esta seção?")) { 
      await deleteSecao(id); 
      await loadSecoes(); 
    } 
  }
  async function handleSaveSecao(secao) {
    await updateSecao(secao.id, { nome: editSecaoNome, emoji: editSecaoEmoji, cor: editSecaoCor });
    setEditSecaoId(null); 
    await loadSecoes();
  }
  async function handleAddTarefa(secao_id) {
    const texto = (novaTarefaTexto[secao_id] || "").trim();
    if (!texto) return;
    await createTarefa({ secao_id, texto, feito: false, tipo: "checkbox" });
    setNovaTarefaTexto(prev => ({ ...prev, [secao_id]: "" })); 
    await loadTarefas(secao_id);
  }
  async function handleToggleTarefa(tarefa) {
    await updateTarefa(tarefa.id, { texto: tarefa.texto, feito: !tarefa.feito, tipo: tarefa.tipo, ordem: tarefa.ordem });
    await loadTarefas(tarefa.secao_id);
  }
  async function handleDeleteTarefa(tarefa) {
    if (confirm("Deletar esta tarefa?")) { 
      await deleteTarefa(tarefa.id); 
      await loadTarefas(tarefa.secao_id); 
    }
  }
  async function handleSaveTarefa(tarefa) {
    await updateTarefa(tarefa.id, { texto: editTarefaTexto, feito: tarefa.feito, tipo: tarefa.tipo, ordem: tarefa.ordem });
    setEditTarefaId(null); 
    await loadTarefas(tarefa.secao_id);
  }
  async function handleUpdateDia() {
    // AQUI ENVIA A DATA NO PADRÃO "YYYY-MM-DDT12:00:00Z"
    await updateDia(dia.id, {
      data: `${diaData}T12:00:00Z`,
      titulo: diaTitulo,
      emoji: diaEmoji,
      capa_url: dia.capa_url
    });
    setEditDia(false);
  }

  return (
    <Container>
      <Button onClick={onBack} style={{ marginBottom: 20, background: "#22223b", color: "#fff" }}>⬅ Voltar</Button>
      <DiaHeader>
        {editDia ? (
          <div>
            <Editable style={{ width: 44, fontSize: 28 }} type="text" maxLength={2} value={diaEmoji} onChange={e => setDiaEmoji(e.target.value)} />
            <Editable type="text" value={diaTitulo} onChange={e => setDiaTitulo(e.target.value)} />
            <Editable
              type="date"
              style={{ fontSize: 18 }}
              value={toInputDateString(diaData)}
              onChange={e => setDiaData(e.target.value)}
            />
            <Button onClick={handleUpdateDia}>Salvar</Button>
            <Button onClick={() => setEditDia(false)} style={{ background: "#444" }}>Cancelar</Button>
          </div>
        ) : (
          <span style={{ cursor: "pointer", fontSize: 28, fontWeight: 700 }} onClick={() => setEditDia(true)}>
            <span style={{ fontSize: 32 }}>{diaEmoji}</span> {diaTitulo}{" "}
            <span style={{ color: "#aaa", fontSize: 18 }}>
              {new Date(diaData).toLocaleDateString("pt-BR")}
            </span>
            <span style={{ marginLeft: 10, fontSize: 18, color: "#38bdf8" }}>✏️</span>
          </span>
        )}
      </DiaHeader>

      <div style={{ display: "flex", marginBottom: 28 }}>
        <AddInput type="text" placeholder="Nome da Seção" value={novaSecao} onChange={e => setNovaSecao(e.target.value)} />
        <AddInput type="text" maxLength={2} style={{ width: 48 }} value={novoEmoji} onChange={e => setNovoEmoji(e.target.value)} />
        <AddInput type="color" style={{ width: 48, padding: 0 }} value={novaCor} onChange={e => setNovaCor(e.target.value)} />
        <Button onClick={handleAddSecao}>+</Button>
      </div>

      <AnimatePresence>
        {secoes.length === 0 && <p style={{ color: "#888", textAlign: "center" }}>Nenhuma seção cadastrada.</p>}
        {secoes.map(secao => (
          <SecaoCard
            key={secao.id}
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 32 }}
            transition={{ duration: 0.2 }}
            style={{ borderLeft: `8px solid ${secao.cor || "#22d3ee"}` }}
          >
            <TituloSecao>
              {editSecaoId === secao.id ? (
                <span>
                  <Editable style={{ width: 40, fontSize: 20 }} type="text" maxLength={2} value={editSecaoEmoji} onChange={e => setEditSecaoEmoji(e.target.value)} />
                  <Editable type="text" value={editSecaoNome} onChange={e => setEditSecaoNome(e.target.value)} />
                  <Editable type="color" style={{ width: 32 }} value={editSecaoCor} onChange={e => setEditSecaoCor(e.target.value)} />
                  <Button onClick={() => handleSaveSecao(secao)}>Salvar</Button>
                  <Button onClick={() => setEditSecaoId(null)} style={{ background: "#444" }}>Cancelar</Button>
                </span>
              ) : (
                <span style={{ cursor: "pointer" }} onClick={() => {
                  setEditSecaoId(secao.id); setEditSecaoNome(secao.nome);
                  setEditSecaoEmoji(secao.emoji); setEditSecaoCor(secao.cor);
                }}>
                  <span style={{ fontSize: 22, marginRight: 8 }}>{secao.emoji}</span>
                  {secao.nome}
                  <span style={{ marginLeft: 8, fontSize: 16, color: "#38bdf8" }}>✏️</span>
                </span>
              )}
              <DeleteButton onClick={() => handleDeleteSecao(secao.id)}>🗑</DeleteButton>
            </TituloSecao>
            <TaskList>
              <AnimatePresence>
                {(tarefasPorSecao[secao.id] || []).map(tarefa => (
                  <TaskItem
                    key={tarefa.id}
                    initial={{ opacity: 0, x: 40 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -40 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Checkbox type="checkbox" checked={!!tarefa.feito} onChange={() => handleToggleTarefa(tarefa)} />
                    {editTarefaId === tarefa.id ? (
                      <>
                        <Editable style={{ fontSize: 16 }} type="text" value={editTarefaTexto} onChange={e => setEditTarefaTexto(e.target.value)} onKeyDown={e => { if (e.key === "Enter") handleSaveTarefa(tarefa); }} />
                        <Button onClick={() => handleSaveTarefa(tarefa)}>Salvar</Button>
                        <Button onClick={() => setEditTarefaId(null)} style={{ background: "#444" }}>Cancelar</Button>
                      </>
                    ) : (
                      <span
                        style={{
                          textDecoration: tarefa.feito ? "line-through" : "none",
                          color: tarefa.feito ? "#22d3ee" : "#e2e8f0",
                          fontWeight: tarefa.feito ? 500 : 400,
                          fontSize: 18,
                          cursor: "pointer",
                          flex: 1
                        }}
                        onClick={() => {
                          setEditTarefaId(tarefa.id);
                          setEditTarefaTexto(tarefa.texto);
                        }}
                      >
                        {tarefa.texto}
                        <span style={{ marginLeft: 8, fontSize: 15, color: "#38bdf8" }}>✏️</span>
                      </span>
                    )}
                    <DeleteButton onClick={() => handleDeleteTarefa(tarefa)}>✖</DeleteButton>
                  </TaskItem>
                ))}
              </AnimatePresence>
              <TaskItem>
                <AddInput type="text" placeholder="Nova tarefa" value={novaTarefaTexto[secao.id] || ""} onChange={e => setNovaTarefaTexto(prev => ({ ...prev, [secao.id]: e.target.value }))} onKeyDown={e => { if (e.key === "Enter") handleAddTarefa(secao.id); }} />
                <Button onClick={() => handleAddTarefa(secao.id)}>Adicionar</Button>
              </TaskItem>
            </TaskList>
          </SecaoCard>
        ))}
      </AnimatePresence>
    </Container>
  );
}
