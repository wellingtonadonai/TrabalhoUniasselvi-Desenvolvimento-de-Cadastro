import axios from "axios";
import { useEffect, useState } from "react";
import Formulario from "./components/Formulario";
import Header from "./components/Header";
import Lista from "./components/Lista";

// ⚠️ IMPORTANTE: Verifique se no seu Java o @RequestMapping é "/produtos" ou "/api/produtos"
// Eles precisam ser IDÊNTICOS. Vou deixar "/produtos" baseado no nosso ajuste anterior.
const api = "http://localhost:8080/api/produtos"; 

export default function App() {
  const [produtos, setProdutos] = useState([]);
  const [busca, setBusca] = useState("");
  
  // Estado para guardar a mensagem de erro (Ex: "Produto já cadastrado")
  const [mensagemErro, setMensagemErro] = useState(""); 

  const [novoProduto, setNovoProduto] = useState({
    nome: "",
    preco: "",
    categoria: "",
    quantidade: ""
  });
  
  const [idEdicao, setIdEdicao] = useState(null);

  // 🔹 Carregar produtos do backend
  async function carregarProdutos() {
    try {
      const res = await axios.get(api);
      setProdutos(res.data);
    } catch (err) {
      console.error("Erro ao carregar produtos:", err);
      setMensagemErro("Não foi possível conectar ao servidor. O Backend está rodando?");
    }
  }

  useEffect(() => {
    carregarProdutos();
  }, []);

  // 🔹 Atualizar campos do formulário
  function handleInputChange(e) {
    const { name, value } = e.target;
    
    // UX: Se o usuário começou a corrigir, sumimos com o erro vermelho
    if (mensagemErro) setMensagemErro(""); 

    setNovoProduto({
      ...novoProduto,
      [name]: name === "preco" || name === "quantidade" ? Number(value) : value
    });
  }

  // 🔹 Salvar produto (Aqui está a correção principal)
  async function handleSalvar(e) {
    e.preventDefault();
    setMensagemErro(""); // Limpa erros antigos

    // Validação simples no Front
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
      
      // Se chegou aqui, deu certo!
      await carregarProdutos(); 
      setNovoProduto({ nome: "", preco: 0, categoria: "", quantidade: 1 });
      setIdEdicao(null);
      setMensagemErro(""); 

    } catch (err) {
      console.error("Erro ao salvar:", err);

      // --- LÓGICA DE CAPTURA DO ERRO DO JAVA ---
      if (err.response && err.response.data) {
        // Tenta pegar a mensagem nos formatos mais comuns do Spring Boot
        const msgBackend = err.response.data.message || err.response.data.mensagem;

        if (msgBackend) {
            setMensagemErro(msgBackend); // Mostra: "Produto já cadastrado..."
        } else {
            // Se o Java mandou erro mas escondeu a mensagem
            setMensagemErro(`Erro ${err.response.status}: O servidor rejeitou, mas não disse o motivo.`);
        }
      } else if (err.request) {
        setMensagemErro("Erro de conexão: O Backend parece estar desligado.");
      } else {
        setMensagemErro("Erro desconhecido ao tentar salvar.");
      }
    }
  }

  // 🔹 Editar produto
  function handleEditar(produto) {
    setNovoProduto(produto);
    setIdEdicao(produto.id);
    setMensagemErro(""); // Limpa erros ao entrar no modo edição
  }

  // 🔹 Cancelar edição
  function handleCancelar() {
    setNovoProduto({ nome: "", preco: 0, categoria: "", quantidade: 1 });
    setIdEdicao(null);
    setMensagemErro("");
  }

  // 🔹 Remover produto
  async function handleRemover(id) {
    if (window.confirm("Tem certeza que deseja remover?")) {
      try {
        await axios.delete(`${api}/${id}`);
        await carregarProdutos();
      } catch (err) {
        console.error("Erro ao remover:", err);
        alert("Erro ao remover produto.");
      }
    }
  }

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-8">
      <Header />

      {/* Bloco de Erro Vermelho (Só aparece se tiver mensagemErro) */}
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