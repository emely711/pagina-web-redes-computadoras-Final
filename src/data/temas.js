// src/data/temas.js
// Fuente única de la lista de temas del curso.
// La usan Dashboard.jsx (grid de temas) y Apuntes.jsx (selector de tema al crear una nota).

export const temas = [
  { id: 1, titulo: "Conceptos Básicos de Redes", icon: "🌐", slug: "conceptos-basicos-de-redes", progreso: 0 },
  { id: 2, titulo: "Modelo OSI", icon: "📊", slug: "modelo-osi", progreso: 0 },
  { id: 3, titulo: "Protocolos IP, ICMP, TCP y UDP", icon: "🔌", slug: "protocolos-ip-icmp-tcp-y-udp", progreso: 0 },
  { id: 4, titulo: "Direccionamiento IPV4", icon: "🎯", slug: "direccionamiento-ipv4", progreso: 0 },
  { id: 5, titulo: "Enrutamiento Dinámico", icon: "🔄", slug: "enrutamiento-dinamico", progreso: 0 },
  { id: 6, titulo: "Topologías y Medios TX", icon: "🔗", slug: "topologias-y-medios-tx", progreso: 0 },
  { id: 7, titulo: "Protocolo ARP, RARP", icon: "📍", slug: "protocolo-arp-rarp", progreso: 0 },
  { id: 8, titulo: "Capa Aplicación", icon: "💼", slug: "capa-aplicacion", progreso: 0 },
  { id: 9, titulo: "Cableado Estructurado", icon: "🏗️", slug: "cableado-estructurado", progreso: 0 },
];

export default temas;
