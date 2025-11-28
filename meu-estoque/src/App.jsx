import axios from "axios";
import { useEffect, useState } from "react";
import Formulario from "./components/Formulario";
import Header from "./components/Header";
import Lista from "./components/Lista";

// IMPORTANTE: Mantenha a URL que está funcionando no seu log
const api = "http://localhost:8080/api/produtos"; 

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

  async function carregarProdutos() {
    try {
      const res = await axios.get(api);
      setProdutos(res.data);
    } catch (err) {
      console.error("Erro ao carregar:", err);
      setMensagemErro("Não foi possível carregar os produtos.");
    }
  }

  useEffect(() => {
    carregarProdutos();
  }, []);

  function handleInputChange(e) {
    const { name, value } = e.target;
    if (mensagemErro) setMensagemErro(""); 
    setNovoProduto({
      ...novoProduto,
      [name]: name === "preco" || name === "quantidade" ? Number(value) : value
    });
  }

  // --- AQUI ESTÁ A CORREÇÃO PRINCIPAL ---
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
      setNovoProduto({ nome: "", preco: 0, categoria: "", quantidade: 1 });
      setIdEdicao(null);
      setMensagemErro(""); 

    } catch (err) {
      console.log("Erro capturado:", err);

      // 1. Verifica se o backend respondeu
      if (err.response && err.response.data) {
        
        // 2. Tenta pegar a mensagem exatamente como vimos no seu log ("mensagem")
        // O log mostrou: data: { mensagem: "Produto já cadastrado", codigo: 409 }
        const textoDoBackend = err.response.data.mensagem; 

        if (textoDoBackend) {
            setMensagemErro(textoDoBackend); // Deve mostrar: "Produto já cadastrado"
        } else {
            // Caso de fallback se o nome mudar
            setMensagemErro(err.response.data.message || "Erro ao salvar produto.");
        }
      } else {
        setMensagemErro("Erro de conexão com o servidor.");
      }
    }
  }

  function handleEditar(produto) {
    setNovoProduto(produto);
    setIdEdicao(produto.id);
    setMensagemErro("");
  }

  function handleCancelar() {
    setNovoProduto({ nome: "", preco: 0, categoria: "", quantidade: 1 });
    setIdEdicao(null);
    setMensagemErro("");
  }

  async function handleRemover(id) {
    if (window.confirm("Tem certeza que deseja remover?")) {
      try {
        await axios.delete(`${api}/${id}`);
        await carregarProdutos();
      } catch (err) {
        alert("Erro ao remover produto.");
      }
    }
  }

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-8">
      <Header />

      {/* Exibe o erro se houver */}
      {mensagemErro && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
            <strong className="font-bold">Atenção: </strong>
            <span className="block sm:inline">{mensagemErro}</span>
        </div>
      )}

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
  );
}