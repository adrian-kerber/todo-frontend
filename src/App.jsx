import { useEffect, useState } from "react";
import { styled } from "./styles/stitches.config";
import { getDias, createDia, deleteDia } from "./api/api";
import { DiaDetalhe } from "./pages/diadetalhe";

const Container = styled("div", {
  maxWidth: 480,
  margin: "0 auto",
  padding: "$md"
});
const DiaCard = styled("div", {
  background: "$surface",
  padding: "$sm",
  borderRadius: "$md",
  marginBottom: "$sm",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  cursor: "pointer",
  transition: "background 0.2s",
  "&:hover": { background: "$primary" }
});
const AddDiaInput = styled("input", {
  background: "$surface",
  color: "$text",
  padding: "$xs",
  border: "1px solid $muted",
  borderRadius: "$sm",
  width: "calc(100% - 32px)",
  marginRight: "$xs"
});
const Button = styled("button", {
  background: "$accent",
  color: "#18181b",
  border: "none",
  borderRadius: "$sm",
  padding: "$xs $sm",
  cursor: "pointer",
  fontWeight: "bold"
});

export function App() {
  const [dias, setDias] = useState([]);
  const [novoTitulo, setNovoTitulo] = useState("");
  const [novoEmoji, setNovoEmoji] = useState("📝");
  const [novaData, setNovaData] = useState("");
  const [diaSelecionado, setDiaSelecionado] = useState(null);

  useEffect(() => {
    loadDias();
  }, []);

  async function loadDias() {
    setDias(await getDias());
  }

  async function handleAddDia() {
    if (!novoTitulo || !novaData) return;
    await createDia({
      data: novaData,
      titulo: novoTitulo,
      emoji: novoEmoji
    });
    setNovoTitulo("");
    setNovoEmoji("📝");
    setNovaData("");
    loadDias();
  }

  async function handleDeleteDia(id) {
    if (confirm("Deletar esse dia?")) {
      await deleteDia(id);
      loadDias();
    }
  }

  if (diaSelecionado) {
    return (
      <DiaDetalhe
        dia={diaSelecionado}
        onBack={() => {
          setDiaSelecionado(null);
          loadDias();
        }}
      />
    );
  }

  return (
    <Container>
      <h1 style={{ textAlign: "center" }}>🌑 Rotina</h1>
      <div style={{ display: "flex", marginBottom: 16 }}>
        <AddDiaInput
          type="text"
          placeholder="Título"
          value={novoTitulo}
          onChange={e => setNovoTitulo(e.target.value)}
        />
        <AddDiaInput
          type="date"
          value={novaData}
          onChange={e => setNovaData(e.target.value)}
        />
        <AddDiaInput
          type="text"
          maxLength={2}
          style={{ width: 40 }}
          value={novoEmoji}
          onChange={e => setNovoEmoji(e.target.value)}
        />
        <Button onClick={handleAddDia}>+</Button>
      </div>
      {dias.length === 0 && <p>Nenhum dia cadastrado.</p>}
      {dias.map(dia => (
        <DiaCard key={dia.id} onClick={() => setDiaSelecionado(dia)}>
          <span>
            <span style={{ fontSize: 22, marginRight: 8 }}>{dia.emoji}</span>
            {dia.titulo} - {new Date(dia.data).toLocaleDateString("pt-BR")}
          </span>
          <Button
            onClick={e => {
              e.stopPropagation();
              handleDeleteDia(dia.id);
            }}
          >
            🗑️
          </Button>
        </DiaCard>
      ))}
    </Container>
  );
}
