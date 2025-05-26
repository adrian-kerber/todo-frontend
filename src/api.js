const BASE_URL = import.meta.env.VITE_API_URL || "https://todo-backend-nwuf.onrender.com";

// Dias
export const getDias = () => fetch(`${BASE_URL}/dias`).then(res => res.json());
export const createDia = (data) => fetch(`${BASE_URL}/dias`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(data)
}).then(res => res.json());
export const updateDia = (id, data) => fetch(`${BASE_URL}/dias/${id}`, {
  method: "PUT",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(data)
}).then(res => res.json());
export const deleteDia = (id) => fetch(`${BASE_URL}/dias/${id}`, { method: "DELETE" }).then(res => res.json());

// Seções
export const getSecoes = (dia_id) => fetch(`${BASE_URL}/secoes/dia/${dia_id}`).then(res => res.json());
export const createSecao = (data) => fetch(`${BASE_URL}/secoes`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(data)
}).then(res => res.json());
export const updateSecao = (id, data) => fetch(`${BASE_URL}/secoes/${id}`, {
  method: "PUT",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(data)
}).then(res => res.json());
export const deleteSecao = (id) => fetch(`${BASE_URL}/secoes/${id}`, { method: "DELETE" }).then(res => res.json());

// Tarefas
export const getTarefas = (secao_id) => fetch(`${BASE_URL}/tarefas/secao/${secao_id}`).then(res => res.json());
export const createTarefa = (data) => fetch(`${BASE_URL}/tarefas`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(data)
}).then(res => res.json());
export const updateTarefa = (id, data) => fetch(`${BASE_URL}/tarefas/${id}`, {
  method: "PUT",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(data)
}).then(res => res.json());
export const deleteTarefa = (id) => fetch(`${BASE_URL}/tarefas/${id}`, { method: "DELETE" }).then(res => res.json());
