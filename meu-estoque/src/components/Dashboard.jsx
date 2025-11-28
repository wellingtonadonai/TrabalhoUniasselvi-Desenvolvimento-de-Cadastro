import axios from "axios";
import { useEffect, useState } from "react";
import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

// Cores bonitas para as fatias do gráfico
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

export default function Dashboard() {
  const [dados, setDados] = useState([]);

  // Busca os dados do endpoint novo que criamos no Java
  useEffect(() => {
    axios.get("http://localhost:8080/produtos/dashboard") // Ajuste se sua URL for diferente
      .then(resposta => {
        setDados(resposta.data);
      })
      .catch(erro => console.error("Erro ao carregar dashboard:", erro));
  }, []); // O array vazio [] garante que só rode uma vez ao abrir a tela

  // Se não tiver dados, não mostra nada
  if (dados.length === 0) return null;

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 mb-8">
      <h2 className="text-xl font-semibold text-gray-800 mb-4 text-center">
        📊 Estoque por Categoria
      </h2>

      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={dados}
              cx="50%" // Centraliza X
              cy="50%" // Centraliza Y
              labelLine={false}
              label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`} // Mostra o nome e %
              outerRadius={100} // Tamanho da pizza
              fill="#8884d8"
              dataKey="quantidade" // O campo do Java que tem o número
              nameKey="categoria"  // O campo do Java que tem o nome
            >
              {dados.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip /> {/* Mostra detalhes ao passar o mouse */}
            <Legend verticalAlign="bottom" height={36}/>
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}