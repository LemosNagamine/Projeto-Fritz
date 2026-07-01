import { r as reactExports } from "./worker-entry-CiqFgXEX.js";
const initialComments = [
  {
    id: "c1",
    street: "Rua das Acácias",
    author: "Marina",
    text: "Bem iluminada à noite, muito movimento até umas 22h.",
    rating: "safe",
    createdAt: Date.now() - 36e5
  },
  {
    id: "c2",
    street: "Travessa do Beco",
    author: "Júlia",
    text: "Evitem passar sozinhas depois das 19h, muito escura.",
    rating: "danger",
    createdAt: Date.now() - 72e5
  },
  {
    id: "c3",
    street: "Avenida Central",
    author: "Carla",
    text: "Tem segurança 24h perto da padaria, ótimo ponto de apoio.",
    rating: "safe",
    createdAt: Date.now() - 864e5
  },
  {
    id: "c4",
    street: "Rua do Parque",
    author: "Bia",
    text: "Cuidado, vi alguém estranho seguindo mulheres ontem.",
    rating: "caution",
    createdAt: Date.now() - 18e5
  }
];
const initialZones = [
  { id: "z1", name: "Beco escuro", x: 320, y: 240, radius: 70, level: "danger", reason: "Pouca iluminação, sem movimento" },
  { id: "z2", name: "Viaduto isolado", x: 700, y: 380, radius: 90, level: "danger", reason: "Área isolada, relatos recentes" },
  { id: "z3", name: "Praça vazia", x: 520, y: 600, radius: 80, level: "caution", reason: "Pouco movimento à noite" },
  { id: "z4", name: "Túnel velho", x: 180, y: 720, radius: 65, level: "danger", reason: "Sem iluminação, isolado" }
];
const initialContacts = [
  { id: "e1", name: "Polícia Militar", phone: "190", relation: "Emergência", notify: true },
  { id: "e2", name: "Delegacia da Mulher", phone: "180", relation: "Apoio especializado", notify: true }
];
const state = {
  comments: initialComments,
  zones: initialZones,
  contacts: initialContacts,
  userName: "Convidada"
};
const listeners = /* @__PURE__ */ new Set();
const notify = () => listeners.forEach((l) => l());
const safetyStore = {
  getState: () => state,
  subscribe(cb) {
    listeners.add(cb);
    return () => listeners.delete(cb);
  },
  addComment(c) {
    state.comments = [
      { ...c, id: crypto.randomUUID(), createdAt: Date.now() },
      ...state.comments
    ];
    notify();
  },
  addContact(c) {
    state.contacts = [...state.contacts, { ...c, id: crypto.randomUUID() }];
    notify();
  },
  removeContact(id) {
    state.contacts = state.contacts.filter((c) => c.id !== id);
    notify();
  },
  setContactNotify(id, notifyFlag) {
    state.contacts = state.contacts.map((c) => c.id === id ? { ...c, notify: notifyFlag } : c);
    notify();
  },
  setUserName(name) {
    state.userName = name;
    notify();
  }
};
function useSafetyStore(selector) {
  return reactExports.useSyncExternalStore(
    (cb) => safetyStore.subscribe(cb),
    () => selector(state),
    () => selector(state)
  );
}
export {
  safetyStore as s,
  useSafetyStore as u
};
