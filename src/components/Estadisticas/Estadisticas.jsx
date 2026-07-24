import {
Chart as ChartJS,
CategoryScale,
LinearScale,
BarElement,
ArcElement,
Tooltip,
Legend,
} from "chart.js";
import { Bar, Doughnut } from "react-chartjs-2";
import { temas } from "../../data/temas";
import "./Estadisticas.css";

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend);

export default function Estadisticas({ apuntes = [] }) {
const conteoPorTema = temas.map((t) => ({
    titulo: t.titulo,
    icon: t.icon,
    count: apuntes.filter((a) => a.temaSlug === t.slug).length,
}));

const sinTemaEspecifico = apuntes.filter((a) => !a.temaSlug).length;

const temasConApuntes = conteoPorTema.filter((t) => t.count > 0).length;
const temasSinApuntes = temas.length - temasConApuntes;

const barData = {
    labels: [...conteoPorTema.map((t) => `${t.icon} ${t.titulo}`), "📌 General"],
    datasets: [
    {
        label: "Apuntes por tema",
        data: [...conteoPorTema.map((t) => t.count), sinTemaEspecifico],
        backgroundColor: "rgba(255, 127, 80, 0.7)",
        borderColor: "#ff7f50",
        borderWidth: 1,
        borderRadius: 6,
    },
    ],
};

const barOptions = {
    responsive: true,
    plugins: {
    legend: { display: false },
    tooltip: {
        callbacks: {
        title: (items) => items[0].label.replace(/^\S+\s/, ""),
        },
    },
    },
    scales: {
    x: {
        ticks: { color: "#a8b5d1", font: { size: 10 } },
        grid: { color: "rgba(168, 181, 209, 0.1)" },
    },
    y: {
        ticks: { color: "#a8b5d1", stepSize: 1, precision: 0 },
        grid: { color: "rgba(168, 181, 209, 0.1)" },
        beginAtZero: true,
    },
    },
};

const doughnutData = {
    labels: ["Temas con apuntes", "Temas sin apuntes"],
    datasets: [
    {
        data: [temasConApuntes, temasSinApuntes],
        backgroundColor: ["#ff7f50", "#2d4059"],
        borderColor: "#1a2235",
        borderWidth: 2,
    },
    ],
};

const doughnutOptions = {
    responsive: true,
    plugins: {
    legend: {
        position: "bottom",
        labels: { color: "#e2e8f0", font: { size: 12 } },
    },
    },
};

return (
    <div className="est-section">
    <h2 className="dash-section-title">📊 Mis Estadísticas</h2>

    {apuntes.length === 0 ? (
        <p className="est-empty">
        Crea tu primer apunte para empezar a ver tus estadísticas aquí. 📈
        </p>
    ) : (
        <div className="est-grid">
        <div className="est-card">
            <h3 className="est-card-titulo">Apuntes por tema</h3>
            <div className="est-chart-wrapper">
            <Bar data={barData} options={barOptions} />
            </div>
        </div>

        <div className="est-card">
            <h3 className="est-card-titulo">Progreso de cobertura del temario</h3>
            <div className="est-chart-wrapper est-chart-doughnut">
            <Doughnut data={doughnutData} options={doughnutOptions} />
            </div>
        </div>
        </div>
    )}
    </div>
);
}