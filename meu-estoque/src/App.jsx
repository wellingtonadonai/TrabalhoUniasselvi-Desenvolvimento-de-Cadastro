import axios from "axios";
import { useEffect, useState } from "react";
import Formulario from "./components/Formulario";
import Header from "./components/Header";
import Lista from "./components/Lista";

// ⚠️ Confirmado pelo seu log: a URL correta é esta
const api = "http://localhost:8080/api/produtos"; 

export default function App() {
  const [produtos, setProdutos] = useState([]);
  const [busca, setBusca] = useState("");
  
  // Estado para guardar a mensagem de erro que vem do Java
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
      setMensagemErro("Não foi possível carregar os produtos. O servidor está ligado?");
    }
  }

  useEffect(() => {
    carregarProdutos();
  }, []);

  // 🔹 Atualizar campos do formulário
  function handleInputChange(e) {
    const { name, value } = e.target;
    
    // Se o usuário começar a digitar, limpamos a mensagem de erro
    if (mensagemErro) setMensagemErro(""); 

    setNovoProduto({
      ...novoProduto,
      [name]: name === "preco" || name === "quantidade" ? Number(value) : value
    });
  }

  // 🔹 Salvar produto (AQUI ESTAVA O PROBLEMA, AGORA ESTÁ CORRIGIDO)
  async function handleSalvar(e) {
    e.preventDefault();
    setMensagemErro(""); // Limpa erro antigo antes de tentar

    // Validação básica do Front
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
      console.log("Erro capturado pelo React:", err);

      // LÓGICA PARA PEGAR A MENSAGEM DO JAVA
      if (err.response && err.response.data) {
        
        // Pega 'mensagem' (que vimos no seu log) ou 'message' (padrão)
        const msgBackend = err.response.data.mensagem || err.response.data.message;

        if (msgBackend) {
            setMensagemErro(msgBackend); // <--- Isso joga o texto na tarja vermelha
        } else {
            setMensagemErro(`Erro ${err.response.status}: Ocorreu um erro, mas o servidor não disse o motivo.`);
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
    setMensagemErro("");
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
        console.error(err);
        alert("Erro ao remover produto.");
      }
    }
  }

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-8">
      <Header />

      {/* 🔹 BLOCO VERMELHO DE ERRO (Só aparece se mensagemErro tiver texto) */}
      {mensagemErro && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
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