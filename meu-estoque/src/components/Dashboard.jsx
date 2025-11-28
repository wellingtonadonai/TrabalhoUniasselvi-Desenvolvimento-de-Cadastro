import { AlertTriangle, BarChart2, DollarSign, Layers, Package, TrendingUp } from "lucide-react";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

export default function Dashboard({ produtos }) {
  
  // 1. Cálculos dos Dados e KPIs (Indicadores Chave de Desempenho)
  const { dadosDoGrafico, totalItens, valorTotalEstoque, baixoEstoque, totalCategorias } = (() => {
    if (!produtos || produtos.length === 0) {
      return { dadosDoGrafico: [], totalItens: 0, valorTotalEstoque: 0, baixoEstoque: 0, totalCategorias: 0 };
    }

    // Agrupa por categoria para o gráfico
    const agrupado = produtos.reduce((acc, produto) => {
      const categoria = produto.categoria || 'Sem Categoria';
      acc[categoria] = (acc[categoria] || 0) + 1;
      return acc;
    }, {});

    const dados = Object.keys(agrupado).map(key => ({
      name: key,
      value: agrupado[key]
    }));

    // Ordena do maior para o menor
    dados.sort((a, b) => b.value - a.value);

    // Cálculos Financeiros e de Estoque
    const totalItens = produtos.reduce((acc, p) => acc + (p.quantidade || 0), 0);
    const valorTotal = produtos.reduce((acc, p) => acc + (p.preco * p.quantidade), 0);
    const estoqueBaixo = produtos.filter(p => p.quantidade < 5).length; // Regra: Menos de 5 é baixo

    return { 
      dadosDoGrafico: dados, 
      totalItens: totalItens,
      valorTotalEstoque: valorTotal,
      baixoEstoque: estoqueBaixo,
      totalCategorias: dados.length
    };
  })();

  // --- ESTADO VAZIO ---
  if (dadosDoGrafico.length === 0) {
    return (
      <div className="bg-gray-50 border-2 border-dashed border-gray-300 p-10 rounded-2xl mb-8 flex flex-col items-center justify-center text-center h-[300px] transition-all hover:border-blue-300 group">
        <div className="bg-white p-4 rounded-full shadow-sm mb-4 group-hover:scale-110 transition-transform duration-300">
          <BarChart2 size={40} className="text-gray-300 group-hover:text-blue-400 transition-colors" />
        </div>
        <h3 className="text-xl font-semibold text-gray-600 mb-2">Aguardando Dados</h3>
        <p className="text-gray-400 max-w-sm mx-auto">
          Cadastre produtos para visualizar os indicadores de desempenho e gráficos.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 mb-8">
      
      {/* --- SEÇÃO 1: CARTÕES DE INDICADORES (KPIs) --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* Card: Valor Financeiro */}
        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between hover:shadow-md transition-shadow">
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Valor em Estoque</p>
            <h3 className="text-2xl font-bold text-gray-800 mt-1">
              R$ {valorTotalEstoque.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </h3>
          </div>
          <div className="bg-green-50 p-3 rounded-lg text-green-600">
            <DollarSign size={24} />
          </div>
        </div>

        {/* Card: Volume de Itens */}
        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between hover:shadow-md transition-shadow">
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Total de Unidades</p>
            <h3 className="text-2xl font-bold text-gray-800 mt-1">{totalItens}</h3>
          </div>
          <div className="bg-blue-50 p-3 rounded-lg text-blue-600">
            <Package size={24} />
          </div>
        </div>

        {/* Card: Alerta de Estoque */}
        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between hover:shadow-md transition-shadow">
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Estoque Baixo</p>
            <h3 className={`text-2xl font-bold mt-1 ${baixoEstoque > 0 ? 'text-orange-600' : 'text-gray-800'}`}>
              {baixoEstoque} <span className="text-sm font-normal text-gray-400">produtos</span>
            </h3>
          </div>
          <div className={`p-3 rounded-lg ${baixoEstoque > 0 ? 'bg-orange-50 text-orange-500' : 'bg-gray-50 text-gray-400'}`}>
            <AlertTriangle size={24} />
          </div>
        </div>
      </div>

      {/* --- SEÇÃO 2: GRÁFICO E TABELA DETALHADA --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Gráfico Donut */}
        <div className="md:col-span-1 bg-white p-6 rounded-2xl shadow-lg border border-gray-100 flex flex-col items-center justify-center relative">
          <h2 className="text-lg font-bold text-gray-700 mb-2 absolute top-6 left-6 flex items-center gap-2">
            <Layers size={18} className="text-blue-500"/> Distribuição
          </h2>
          
          <div className="h-[260px] w-full mt-8">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={dadosDoGrafico}
                  cx="50%"
                  cy="50%"
                  innerRadius={65}
                  outerRadius={85}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {dadosDoGrafico.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)', padding: '12px' }}
                  itemStyle={{ color: '#374151', fontWeight: 600 }}
                />
              </PieChart>
            </ResponsiveContainer>
            
            {/* Centro do Donut */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none mt-4">
              <span className="text-4xl font-extrabold text-gray-800 block tracking-tight">{totalCategorias}</span>
              <span className="text-xs text-gray-400 uppercase font-semibold tracking-wide">Categorias</span>
            </div>
          </div>
        </div>

        {/* Tabela Detalhada */}
        <div className="md:col-span-2 bg-white p-6 rounded-2xl shadow-lg border border-gray-100 flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-gray-700 flex items-center gap-2">
              <TrendingUp size={20} className="text-blue-500"/> Detalhes por Categoria
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wider border-b border-gray-100">
                  <th className="pb-3 pl-2">Categoria</th>
                  <th className="pb-3 text-right">Qtd. Tipos</th>
                  <th className="pb-3 text-right pr-2">Participação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {dadosDoGrafico.map((item, index) => {
                  const totalProdutosUnicos = dadosDoGrafico.reduce((acc, curr) => acc + curr.value, 0);
                  const porcentagem = ((item.value / totalProdutosUnicos) * 100).toFixed(1);
                  const cor = COLORS[index % COLORS.length];

                  return (
                    <tr key={item.name} className="hover:bg-gray-50 transition-colors duration-150 group">
                      <td className="py-3 pl-2">
                        <div className="flex items-center gap-3">
                          <div 
                            className="w-2.5 h-2.5 rounded-full shadow-sm ring-2 ring-gray-50" 
                            style={{ backgroundColor: cor }}
                          ></div>
                          <span className="text-gray-700 font-medium text-sm group-hover:text-blue-700 transition-colors">
                            {item.name}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 text-right">
                        <span className="font-bold text-gray-700 bg-gray-100 px-2.5 py-0.5 rounded-full text-xs group-hover:bg-blue-100 group-hover:text-blue-700 transition-colors">
                          {item.value}
                        </span>
                      </td>
                      <td className="py-3 text-right pr-2">
                        <div className="flex items-center justify-end gap-2">
                          <span className="text-sm text-gray-500 font-medium">{porcentagem}%</span>
                          <div className="w-16 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                            <div 
                              className="h-full rounded-full opacity-80" 
                              style={{ width: `${porcentagem}%`, backgroundColor: cor }}
                            ></div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}