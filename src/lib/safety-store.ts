// Lightweight in-memory store for mock data shared across routes.
// Uses a tiny pub-sub so components re-render on changes.

export type StreetComment = {
  id: string;
  street: string;
  author: string;
  text: string;
  rating: "safe" | "caution" | "danger";
  createdAt: number;
};

export type DangerZone = {
  id: string;
  name: string;
  // Normalized coordinates within the SVG map (0..1000)
  x: number;
  y: number;
  radius: number;
  level: "caution" | "danger";
  reason: string;
};

export type EmergencyContact = {
  id: string;
  name: string;
  phone: string;
  relation: string;
  notify: boolean;
};

const initialComments: StreetComment[] = [
  {
    id: "c1",
    street: "Rua das Acácias",
    author: "Marina",
    text: "Bem iluminada à noite, muito movimento até umas 22h.",
    rating: "safe",
    createdAt: Date.now() - 3600_000,
  },
  {
    id: "c2",
    street: "Travessa do Beco",
    author: "Júlia",
    text: "Evitem passar sozinhas depois das 19h, muito escura.",
    rating: "danger",
    createdAt: Date.now() - 7200_000,
  },
  {
    id: "c3",
    street: "Avenida Central",
    author: "Carla",
    text: "Tem segurança 24h perto da padaria, ótimo ponto de apoio.",
    rating: "safe",
    createdAt: Date.now() - 86400_000,
  },
  {
    id: "c4",
    street: "Rua do Parque",
    author: "Bia",
    text: "Cuidado, vi alguém estranho seguindo mulheres ontem.",
    rating: "caution",
    createdAt: Date.now() - 1800_000,
  },
];

const initialZones: DangerZone[] = [
  { id: "z1", name: "Beco escuro", x: 320, y: 240, radius: 70, level: "danger", reason: "Pouca iluminação, sem movimento" },
  { id: "z2", name: "Viaduto isolado", x: 700, y: 380, radius: 90, level: "danger", reason: "Área isolada, relatos recentes" },
  { id: "z3", name: "Praça vazia", x: 520, y: 600, radius: 80, level: "caution", reason: "Pouco movimento à noite" },
  { id: "z4", name: "Túnel velho", x: 180, y: 720, radius: 65, level: "danger", reason: "Sem iluminação, isolado" },
];

const initialContacts: EmergencyContact[] = [
  { id: "e1", name: "Polícia Militar", phone: "190", relation: "Emergência", notify: true },
  { id: "e2", name: "Delegacia da Mulher", phone: "180", relation: "Apoio especializado", notify: true },
];

type State = {
  comments: StreetComment[];
  zones: DangerZone[];
  contacts: EmergencyContact[];
  userName: string;
};

const state: State = {
  comments: initialComments,
  zones: initialZones,
  contacts: initialContacts,
  userName: "Convidada",
};

const listeners = new Set<() => void>();
const notify = () => listeners.forEach((l) => l());

export const safetyStore = {
  getState: () => state,
  subscribe(cb: () => void) {
    listeners.add(cb);
    return () => listeners.delete(cb);
  },
  addComment(c: Omit<StreetComment, "id" | "createdAt">) {
    state.comments = [
      { ...c, id: crypto.randomUUID(), createdAt: Date.now() },
      ...state.comments,
    ];
    notify();
  },
  addContact(c: Omit<EmergencyContact, "id">) {
    state.contacts = [...state.contacts, { ...c, id: crypto.randomUUID() }];
    notify();
  },
  removeContact(id: string) {
    state.contacts = state.contacts.filter((c) => c.id !== id);
    notify();
  },
  setContactNotify(id: string, notifyFlag: boolean) {
    state.contacts = state.contacts.map((c) => (c.id === id ? { ...c, notify: notifyFlag } : c));
    notify();
  },
  setUserName(name: string) {
    state.userName = name;
    notify();
  },
};

import { useSyncExternalStore } from "react";
export function useSafetyStore<T>(selector: (s: State) => T): T {
  return useSyncExternalStore(
    (cb) => safetyStore.subscribe(cb),
    () => selector(state),
    () => selector(state),
  );
}
