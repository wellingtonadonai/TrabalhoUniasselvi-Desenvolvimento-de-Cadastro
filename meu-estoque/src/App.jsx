import axios from 'axios';
import {
  AlertTriangle,
  BarChart2,
  DollarSign,
  Edit,
  Layers,
  Lock, LogIn,
  Package,
  Plus, Save,
  Search, ShoppingBag,
  Tag,
  Trash2,
  TrendingUp,
  User,
  X
} from 'lucide-react';
import { useEffect, useState } from 'react';
import {
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip
} from 'recharts';

// URL base do Java
const baseUrl = "http://localhost:8080";

// --- CONSTANTE PARA PADRONIZAR A ROTA ---
// CORREÇÃO: Removi o "/api", agora aponta direto para "/produtos"
const RESOURCE_URL = "/produtos"; 

// --- CONFIGURAÇÃO DO AXIOS (INTERCEPTOR) ---
const api = axios.create({
  baseURL: baseUrl
});

// Garante que o token seja enviado em TODAS as requisições
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token && token !== "null" && token !== "undefined") {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => Promise.reject(error));


// ============================================================================
// 1. COMPONENTE LOGIN
// ============================================================================
const Login = ({ onLogin, mensagemInicial }) => {
  const [login, setLogin] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState(mensagemInicial || "");
  const [carregando, setCarregando] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro("");
    setCarregando(true);

    try {
      await onLogin(login, senha);
    } catch (msg) {
      setErro("Usuário ou senha incorretos!");
      setCarregando(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-gray-200">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-blue-600 mb-2">Bem-vindo</h1>
          <p className="text-gray-500">Faça login para gerenciar o estoque</p>
        </div>

        {erro && (
          <div className="bg-red-100 text-red-700 p-3 rounded-lg mb-4 text-sm text-center font-medium border border-red-200">
            {typeof erro === 'string' ? erro : "Erro desconhecido"}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Usuário</label>
            <div className="relative">
              <User className="absolute left-3 top-3 text-gray-400" size={20} />
              <input
                type="text"
                value={login}
                onChange={(e) => setLogin(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
                placeholder="Ex: admin"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Senha</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 text-gray-400" size={20} />
              <input
                type="password"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
                placeholder="••••••"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={carregando}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg shadow-lg flex items-center justify-center gap-2 transition duration-200 disabled:opacity-70"
          >
            {carregando ? "Entrando..." : <><LogIn size={20} /> Entrar no Sistema</>}
          </button>
        </form>
      </div>
    </div>
  );
};

// ============================================================================
// 2. COMPONENTE HEADER
// ============================================================================
const Header = () => (
  <header className="bg-blue-600 text-white p-4 rounded-xl shadow-lg mb-6 flex items-center justify-between">
    <div className="flex items-center gap-2">
      <ShoppingBag size={28} />
      <h1 className="text-2xl font-bold">Gestão de Estoque</h1>
    </div>
    <span className="text-sm bg-blue-700 px-3 py-1 rounded-full">Painel Admin</span>
  </header>
);

// ============================================================================
// 3. COMPONENTE DASHBOARD (VERSÃO PRO CORRIGIDA)
// ============================================================================
const Dashboard = ({ produtos }) => {
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

  const listaSegura = Array.isArray(produtos) ? produtos : [];

  const { dadosDoGrafico, totalItens, valorTotalEstoque, baixoEstoque, totalCategorias } = (() => {
    if (listaSegura.length === 0) {
      return { dadosDoGrafico: [], totalItens: 0, valorTotalEstoque: 0, baixoEstoque: 0, totalCategorias: 0 };
    }

    const agrupado = listaSegura.reduce((acc, produto) => {
      const categoria = produto.categoria || 'Sem Categoria';
      acc[categoria] = (acc[categoria] || 0) + 1;
      return acc;
    }, {});

    const dados = Object.keys(agrupado).map(key => ({
      name: key,
      value: agrupado[key]
    }));

    dados.sort((a, b) => b.value - a.value);

    // --- CORREÇÃO AQUI: Forçando Number() para evitar erros de texto ---
    const totalItens = listaSegura.reduce((acc, p) => acc + Number(p.quantidade || 0), 0);
    
    const valorTotal = listaSegura.reduce((acc, p) => acc + (Number(p.preco || 0) * Number(p.quantidade || 0)), 0);
    
    // Regra: Estoque menor que 5 é considerado baixo
    const estoqueBaixo = listaSegura.filter(p => Number(p.quantidade || 0) < 5).length;

    return { 
      dadosDoGrafico: dados, 
      totalItens,
      valorTotalEstoque: valorTotal,
      baixoEstoque: estoqueBaixo,
      totalCategorias: dados.length
    };
  })();

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
      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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

        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between hover:shadow-md transition-shadow">
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Total de Unidades</p>
            <h3 className="text-2xl font-bold text-gray-800 mt-1">{totalItens}</h3>
          </div>
          <div className="bg-blue-50 p-3 rounded-lg text-blue-600">
            <Package size={24} />
          </div>
        </div>

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

      {/* GRÁFICO E TABELA */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)', padding: '12px' }}/>
              </PieChart>
            </ResponsiveContainer>
            
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none mt-4">
              <span className="text-4xl font-extrabold text-gray-800 block tracking-tight">{totalCategorias}</span>
              <span className="text-xs text-gray-400 uppercase font-semibold tracking-wide">Categorias</span>
            </div>
          </div>
        </div>

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
                          <div className="w-2.5 h-2.5 rounded-full shadow-sm ring-2 ring-gray-50" style={{ backgroundColor: cor }}></div>
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
                            <div className="h-full rounded-full opacity-80" style={{ width: `${porcentagem}%`, backgroundColor: cor }}></div>
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
};

// ============================================================================
// 4. COMPONENTE FORMULÁRIO
// ============================================================================
const Formulario = ({ novoProduto, handleInputChange, handleSalvar, handleCancelar, idEdicao }) => {
  return (
    <div className={`p-6 rounded-xl shadow-lg border transition-colors duration-300 ${idEdicao ? 'bg-yellow-50 border-yellow-200' : 'bg-white border-gray-100'}`}>
      <h2 className={`text-xl font-semibold mb-4 flex items-center gap-2 ${idEdicao ? 'text-yellow-700' : 'text-gray-800'}`}>
        {idEdicao ? (
          <> <Edit size={20} /> Editar Produto </> 
        ) : (
          <> <Plus size={20} className="text-green-500" /> Novo Produto </> 
        )}
      </h2>

      <form onSubmit={handleSalvar} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nome</label>
            <div className="relative">
              <Package className="absolute left-3 top-3 text-gray-400" size={18} />
              <input
                type="text"
                name="nome"
                value={novoProduto.nome}
                onChange={handleInputChange}
                placeholder="Ex: Monitor"
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Preço (R$)</label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-3 text-gray-400" size={18} />
              <input
                type="number"
                name="preco"
                value={novoProduto.preco}
                onChange={handleInputChange}
                placeholder="0.00"
                step="0.01"
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Categoria</label>
            <div className="relative">
              <Tag className="absolute left-3 top-3 text-gray-400" size={18} />
              <select
                name="categoria"
                value={novoProduto.categoria}
                onChange={handleInputChange}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              >
                <option value="">Selecione...</option>
                <option value="Eletrônicos">Eletrônicos</option>
                <option value="Móveis">Móveis</option>
                <option value="Periféricos">Periféricos</option>
                <option value="Outros">Outros</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Quantidade</label>
            <div className="relative">
              <input
                type="number"
                name="quantidade"
                value={novoProduto.quantidade}
                onChange={handleInputChange}
                min="1"
                className="w-full pl-4 pr-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        <div className="flex gap-2 mt-4">
          <button 
            type="submit"
            className={`flex-1 font-bold py-2 px-4 rounded-lg shadow-md flex justify-center items-center gap-2 text-white transition
              ${idEdicao ? 'bg-yellow-600 hover:bg-yellow-700' : 'bg-blue-600 hover:bg-blue-700'}`}
          >
            {idEdicao ? <><Save size={18} /> Salvar Alterações</> : <><Plus size={18} /> Cadastrar Produto</>}
          </button>

          {idEdicao && (
            <button
              type="button"
              onClick={handleCancelar}
              className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-2 px-3 rounded-lg shadow-sm"
              title="Cancelar"
            >
              <X size={20} />
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

// ============================================================================
// 5. COMPONENTE LISTA (TABELA PROFISSIONAL)
// ============================================================================
const Lista = ({ produtos, busca, setBusca, handleEditar, handleRemover, idEdicao }) => {
  const listaSegura = Array.isArray(produtos) ? produtos : [];
  const termoBusca = (busca || "").toLowerCase();

  const produtosFiltrados = listaSegura.filter(produto => 
    (produto.nome || "").toLowerCase().includes(termoBusca) ||
    (produto.categoria || "").toLowerCase().includes(termoBusca)
  );

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 mt-8">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
          <Package size={22} className="text-blue-600" /> Lista de Produtos
        </h2>
        
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Buscar por nome ou categoria..." 
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm"
          />
        </div>
      </div>

      <div className="overflow-x-auto rounded-lg border border-gray-100">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-50 text-gray-600 uppercase text-xs font-bold tracking-wider">
            <tr>
              <th className="p-4 border-b">Nome</th>
              <th className="p-4 border-b">Categoria</th>
              <th className="p-4 border-b text-center">Qtd.</th>
              <th className="p-4 border-b text-right">Preço Unit.</th>
              <th className="p-4 border-b text-center">Ações</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100 text-sm">
            {produtosFiltrados.length === 0 ? (
              <tr>
                <td colSpan="5" className="p-8 text-center text-gray-400 italic">
                  Nenhum produto encontrado.
                </td>
              </tr>
            ) : (
              produtosFiltrados.map((produto) => (
                <tr 
                  key={produto.id} 
                  className={`hover:bg-blue-50 transition-colors duration-150 ${idEdicao === produto.id ? 'bg-yellow-50 border-l-4 border-l-yellow-400' : ''}`}
                >
                  <td className="p-4 font-medium text-gray-800">{produto.nome}</td>
                  <td className="p-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 border border-gray-200">
                      {produto.categoria}
                    </span>
                  </td>
                  <td className="p-4 text-center">
                    <span className={`font-bold ${produto.quantidade < 5 ? 'text-orange-600' : 'text-gray-600'}`}>
                      {produto.quantidade}
                    </span>
                  </td>
                  <td className="p-4 text-right font-mono text-green-600 font-semibold">
                    R$ {Number(produto.preco).toFixed(2)}
                  </td>
                  <td className="p-4 flex justify-center gap-2">
                    <button 
                      onClick={() => handleEditar(produto)}
                      className="p-2 text-yellow-600 hover:bg-yellow-100 rounded-lg transition-colors border border-transparent hover:border-yellow-200"
                      title="Editar"
                    >
                      <Edit size={18} />
                    </button>
                    <button 
                      onClick={() => handleRemover(produto.id)}
                      className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors border border-transparent hover:border-red-200"
                      title="Excluir"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      
      <div className="mt-4 text-right text-xs text-gray-400 border-t border-gray-50 pt-4">
        Exibindo <strong className="text-gray-600">{produtosFiltrados.length}</strong> produto(s)
      </div>
    </div>
  );
};

// ============================================================================
// 6. APP PRINCIPAL
// ============================================================================
export default function App() {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [usuarioLogado, setUsuarioLogado] = useState(!!token); 
  const [loginErro, setLoginErro] = useState("");

  const [produtos, setProdutos] = useState([]);
  const [busca, setBusca] = useState("");
  const [mensagemErro, setMensagemErro] = useState(""); 
  const [novoProduto, setNovoProduto] = useState({ nome: "", preco: "", categoria: "", quantidade: "" });
  const [idEdicao, setIdEdicao] = useState(null);

  if (token) {
    api.defaults.headers.Authorization = `Bearer ${token}`;
  }

  async function handleLogin(login, senha) {
    try {
      const response = await api.post("/auth/login", { login, senha });
      const novoToken = response.data.token;
      
      localStorage.setItem("token", novoToken);
      setToken(novoToken);
      setUsuarioLogado(true);
      
      carregarProdutos(); 

    } catch (error) {
      console.error("Erro no login", error);
      throw error;
    }
  }

  function handleLogout(motivo = "") {
    localStorage.removeItem("token");
    setToken(null);
    setUsuarioLogado(false);
    setProdutos([]);
    delete api.defaults.headers.Authorization;
    if (motivo) setLoginErro(motivo);
  }

  async function carregarProdutos() {
    if (!token && !localStorage.getItem("token")) return;

    try {
      setMensagemErro("");
      const res = await api.get(RESOURCE_URL);
      setProdutos(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Erro ao carregar:", err);
      setProdutos([]);
      if (err.response && err.response.status === 403) {
        handleLogout("Sua sessão expirou. Por favor, faça login novamente.");
      } else {
        setMensagemErro("Não foi possível carregar os produtos. O Backend está ligado?");
      }
    }
  }

  useEffect(() => {
    if (usuarioLogado) {
      carregarProdutos();
    }
  }, [usuarioLogado]);

  function handleInputChange(e) {
    const { name, value } = e.target;
    if (mensagemErro) setMensagemErro(""); 
    setNovoProduto({ ...novoProduto, [name]: name === "preco" || name === "quantidade" ? Number(value) : value });
  }

  async function handleSalvar(e) {
    e.preventDefault();
    setMensagemErro(""); 

    if (!novoProduto.nome || !novoProduto.preco || !novoProduto.categoria || !novoProduto.quantidade) {
      setMensagemErro("Preencha todos os campos!");
      return;
    }

    try {
      if (idEdicao) {
        await api.put(`${RESOURCE_URL}/${idEdicao}`, novoProduto);
      } else {
        await api.post(RESOURCE_URL, novoProduto);
      }
      
      await carregarProdutos(); 
      setNovoProduto({ nome: "", preco: "", categoria: "", quantidade: "" });
      setIdEdicao(null);

    } catch (err) {
      if (err.response && err.response.data) {
        const data = err.response.data;
        const msg = data.mensagem || data.message;
        const msgFinal = typeof msg === 'object' ? JSON.stringify(msg) : String(msg || "Erro ao salvar.");
        setMensagemErro(msgFinal);
      } else {
        setMensagemErro("Erro de conexão.");
      }
    }
  }

  function handleEditar(produto) {
    setNovoProduto(produto);
    setIdEdicao(produto.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function handleCancelar() {
    setNovoProduto({ nome: "", preco: "", categoria: "", quantidade: "" });
    setIdEdicao(null);
  }

  async function handleRemover(id) {
    if (window.confirm("Tem certeza?")) {
      try {
        await api.delete(`${RESOURCE_URL}/${id}`);
        await carregarProdutos();
      } catch (err) {
        alert("Erro ao remover.");
      }
    }
  }

  if (!usuarioLogado) {
    return <Login onLogin={handleLogin} mensagemInicial={loginErro} />;
  }

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-8 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-4">
        <Header />
        <button onClick={() => handleLogout("")} className="text-red-600 font-bold hover:underline text-sm px-4">
          Sair do Sistema
        </button>
      </div>
      
      <Dashboard produtos={produtos} />

      {mensagemErro && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
            <strong className="font-bold">Atenção: </strong> 
            <span className="block sm:inline">{String(mensagemErro)}</span>
        </div>
      )}

      <div className="grid grid-cols-1 gap-6">
        <Formulario
          novoProduto={novoProduto}
          handleInputChange={handleInputChange}
          handleSalvar={handleSalvar}
          handleCancelar={handleCancelar}
          idEdicao={idEdicao}
        />

        <Lista
          produtos={produtos}
          busca={busca}
          setBusca={setBusca}
          handleEditar={handleEditar}
          handleRemover={handleRemover}
          idEdicao={idEdicao}
        />
      </div>
    </div>
  );
}