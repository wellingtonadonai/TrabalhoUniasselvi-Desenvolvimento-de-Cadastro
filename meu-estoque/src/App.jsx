import axios from 'axios';
import {
  DollarSign,
  Edit,
  Package,
  Plus, Save,
  Search, ShoppingBag,
  Tag,
  Trash2,
  X
} from 'lucide-react';
import { useEffect, useState } from 'react';
import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip
} from 'recharts';

// URL da API Java
const api = "http://localhost:8080/produtos";


// ----------------------------------------------------------------------
// COMPONENTE 1: HEADER
// ----------------------------------------------------------------------
const Header = () => (
  <header className="bg-blue-600 text-white p-4 rounded-xl shadow-lg mb-6 flex items-center justify-between">
    <div className="flex items-center gap-2">
      <ShoppingBag size={28} />
      <h1 className="text-2xl font-bold">Gestão de Estoque</h1>
    </div>
    <span className="text-sm bg-blue-700 px-3 py-1 rounded-full">Painel Admin</span>
  </header>
);

// ----------------------------------------------------------------------
// COMPONENTE 2: DASHBOARD
// ----------------------------------------------------------------------
const Dashboard = ({ produtos }) => {
  const [dados, setDados] = useState([]);
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

  useEffect(() => {
    if (!produtos || produtos.length === 0) {
      setDados([]);
      return;
    }

    const agrupado = produtos.reduce((acc, produto) => {
      const cat = produto.categoria || 'Outros';
      acc[cat] = (acc[cat] || 0) + 1;
      return acc;
    }, {});

    const dadosFormatados = Object.keys(agrupado).map(key => ({
      categoria: key,
      quantidade: agrupado[key]
    }));

    setDados(dadosFormatados);
  }, [produtos]);

  if (dados.length === 0) return null;

  return (
    <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 mb-6 flex flex-col items-center">
      <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
        📊 Estoque por Categoria
      </h2>
      <div className="h-[300px] w-full max-w-md">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={dados}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
              outerRadius={100}
              fill="#8884d8"
              dataKey="quantidade"
              nameKey="categoria"
            >
              {dados.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend verticalAlign="bottom" height={36}/>
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

// ----------------------------------------------------------------------
// COMPONENTE 3: FORMULÁRIO
// ----------------------------------------------------------------------
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

        <div className="flex gap-2">
          <button 
            type="submit"
            className={`flex-1 font-bold py-2 px-4 rounded-lg shadow-md flex justify-center items-center gap-2 text-white transition
              ${idEdicao ? 'bg-yellow-600 hover:bg-yellow-700' : 'bg-blue-600 hover:bg-blue-700'}`}
          >
            {idEdicao ? <><Save size={18} /> Salvar</> : <><Plus size={18} /> Cadastrar</>}
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

// ----------------------------------------------------------------------
// COMPONENTE 4: LISTA
// ----------------------------------------------------------------------
const Lista = ({ produtos, busca, setBusca, handleEditar, handleRemover, idEdicao }) => {
  const produtosFiltrados = produtos.filter(produto => 
    produto.nome.toLowerCase().includes(busca.toLowerCase()) ||
    produto.categoria.toLowerCase().includes(busca.toLowerCase())
  );

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 mt-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
          <Package size={20} /> Lista de Produtos
        </h2>
        
        <div className="relative">
          <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
          <input 
            type="text"
            placeholder="Buscar..." 
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {produtosFiltrados.length === 0 ? (
        <p className="text-gray-500 text-center py-4">Nenhum produto encontrado.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-700 border-b">
                <th className="p-3">Nome</th>
                <th className="p-3">Categoria</th>
                <th className="p-3">Qtd</th>
                <th className="p-3">Preço</th>
                <th className="p-3 text-center">Ações</th>
              </tr>
            </thead>
            <tbody>
              {produtosFiltrados.map((produto) => (
                <tr 
                  key={produto.id} 
                  className={`border-b hover:bg-gray-50 transition ${idEdicao === produto.id ? 'bg-yellow-50' : ''}`}
                >
                  <td className="p-3 font-medium text-gray-800">{produto.nome}</td>
                  <td className="p-3">
                    <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                      {produto.categoria}
                    </span>
                  </td>
                  <td className="p-3">{produto.quantidade}</td>
                  <td className="p-3 text-green-600 font-semibold">
                    R$ {Number(produto.preco).toFixed(2)}
                  </td>
                  <td className="p-3 flex justify-center gap-2">
                    <button 
                      onClick={() => handleEditar(produto)}
                      className="text-yellow-600 hover:bg-yellow-100 p-2 rounded-lg transition"
                      title="Editar"
                    >
                      <Edit size={18} />
                    </button>
                    <button 
                      onClick={() => handleRemover(produto.id)}
                      className="text-red-600 hover:bg-red-100 p-2 rounded-lg transition"
                      title="Remover"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

// ----------------------------------------------------------------------
// APP PRINCIPAL
// ----------------------------------------------------------------------
export default function App() {
  const [produtos, setProdutos] = useState([]);
  const [busca, setBusca] = useState("");
  const [mensagemErro, setMensagemErro] = useState(""); 

  const [novoProduto, setNovoProduto] = useState({
    nome: "",
    preco: "",
    categoria: "",
    quantidade: ""
  });
  
  const [idEdicao, setIdEdicao] = useState(null);

  // 1. CARREGAR (Com proteção contra falha de rede)
  async function carregarProdutos() {
    try {
      setMensagemErro("");
      const res = await axios.get(api);
      setProdutos(res.data);
    } catch (err) {
      console.warn("Backend não detetado (Erro de Rede). A carregar dados de exemplo.");
      // FALLBACK: Se falhar (como no preview), carrega dados locais para não quebrar a UI
      setProdutos(DADOS_EXEMPLO);
      setMensagemErro("Aviso: Não foi possível conectar ao Backend. A exibir dados de exemplo.");
    }
  }

  useEffect(() => {
    carregarProdutos();
  }, []);

  // 2. INPUTS
  function handleInputChange(e) {
    const { name, value } = e.target;
    if (mensagemErro) setMensagemErro(""); 

    setNovoProduto({
      ...novoProduto,
      [name]: name === "preco" || name === "quantidade" ? Number(value) : value
    });
  }

  // 3. SALVAR
  async function handleSalvar(e) {
    e.preventDefault();
    setMensagemErro(""); 

    if (!novoProduto.nome || !novoProduto.preco || !novoProduto.categoria || !novoProduto.quantidade) {
      setMensagemErro("Preencha todos os campos!");
      return;
    }

    try {
      if (idEdicao) {
        await axios.put(`${api}/${idEdicao}`, novoProduto);
      } else {
        await axios.post(api, novoProduto);
      }
      
      await carregarProdutos(); 
      setNovoProduto({ nome: "", preco: 0, categoria: "", quantidade: "" });
      setIdEdicao(null);
      setMensagemErro(""); 

    } catch (err) {
      console.log("Erro capturado:", err);

      if (err.response && err.response.data) {
        const msgBackend = err.response.data.mensagem || err.response.data.message;
        if (msgBackend) {
            setMensagemErro(msgBackend);
        } else {
            setMensagemErro(`Erro ${err.response.status}: O servidor rejeitou a operação.`);
        }
      } else if (err.request) {
        setMensagemErro("Erro de conexão: Backend indisponível para salvar.");
      } else {
        setMensagemErro("Erro desconhecido ao tentar salvar.");
      }
    }
  }

  // 4. EDITAR
  function handleEditar(produto) {
    setNovoProduto(produto);
    setIdEdicao(produto.id);
    setMensagemErro("");
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // 5. CANCELAR
  function handleCancelar() {
    setNovoProduto({ nome: "", preco: 0, categoria: "", quantidade: 1 });
    setIdEdicao(null);
    setMensagemErro("");
  }

  // 6. REMOVER
  async function handleRemover(id) {
    if (window.confirm("Tem certeza que deseja remover este produto?")) {
      try {
        await axios.delete(`${api}/${id}`);
        await carregarProdutos();
      } catch (err) {
        console.error(err);
        alert("Erro ao remover: Backend indisponível.");
      }
    }
  }

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6 bg-gray-50 min-h-screen">
      <Header />
      
      {mensagemErro && (
        <div className={`border px-4 py-3 rounded-lg relative ${mensagemErro.includes("Aviso") ? 'bg-orange-100 border-orange-400 text-orange-700' : 'bg-red-100 border-red-400 text-red-700'}`}>
            <strong className="font-bold">Atenção: </strong>
            <span className="block sm:inline">{mensagemErro}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Dashboard produtos={produtos} />
        
        <Formulario
          novoProduto={novoProduto}
          handleInputChange={handleInputChange}
          handleSalvar={handleSalvar}
          handleCancelar={handleCancelar}
          idEdicao={idEdicao}
        />
      </div>

      <Lista
        produtos={produtos}
        busca={busca}
        setBusca={setBusca}
        handleEditar={handleEditar}
        handleRemover={handleRemover}
        idEdicao={idEdicao}
      />
    </div>
  );
}