import axios from "axios";
import { useEffect, useState } from "react";
import Formulario from "./components/Formulario";
import Header from "./components/Header";
import Lista from "./components/Lista";

const api = "http://localhost:8080/api/produtos"; // CONFERIR: Se no Java está @RequestMapping("/produtos"), aqui deve ser igual.

export default function App() {
  const [produtos, setProdutos] = useState([]);
  const [busca, setBusca] = useState("");
  
  // 1. NOVO: Estado para guardar a mensagem de erro que vem do Java
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
    
    // Dica: Limpar o erro assim que o usuário começa a digitar para corrigir
    if (mensagemErro) setMensagemErro(""); 

    setNovoProduto({
      ...novoProduto,
      [name]: name === "preco" || name === "quantidade" ? Number(value) : value
    });
  }

  // 🔹 Salvar produto
  async function handleSalvar(e) {
    e.preventDefault();
    
    // Limpa erros anteriores antes de tentar
    setMensagemErro(""); 

    if (!novoProduto.nome || !novoProduto.preco || !novoProduto.categoria || !novoProduto.quantidade) {
      setMensagemErro("Preencha todos os campos!"); // Usa nosso estado de erro visual
      return;
    }

    try {
      if (idEdicao) {
        await axios.put(`${api}/${idEdicao}`, novoProduto);
      } else {
        await axios.post(api, novoProduto);
      }
      
      await carregarProdutos(); // atualiza a lista
      
      // Limpa tudo com sucesso
      setNovoProduto({ nome: "", preco: 0, categoria: "", quantidade: 1 });
      setIdEdicao(null);
      setMensagemErro(""); 

} catch (err) {
    console.error("Erro completo:", err);

    // PASSO 1: Verificamos se o servidor respondeu algo (ex: 409, 404, 500)
    if (err.response && err.response.data) {
      
      // PASSO 2: Tentamos pegar a mensagem.
      // O Spring Boot padrão manda na propriedade 'message'.
      // Se você usou GlobalExceptionHandler, pode ser 'mensagem'.
      // Se for apenas uma string solta, pegamos o próprio data.
      const mensagemDoBackend = err.response.data.message 
                             || err.response.data.mensagem 
                             || (typeof err.response.data === 'string' ? err.response.data : null);

      if (mensagemDoBackend) {
        setMensagemErro(mensagemDoBackend); // <--- AQUI MOSTRA NA TELA
      } else {
        // Se chegou o JSON mas sem texto de mensagem (Cenário A que falei antes)
        setMensagemErro("Erro " + err.response.status + ": Ocorreu um conflito, mas o servidor não detalhou o motivo.");
      }
      
    } else if (err.request) {
      // O servidor nem respondeu (Backend desligado?)
      setMensagemErro("Sem resposta do servidor. Verifique se o Backend está rodando.");
    } else {
      setMensagemErro("Erro na configuração da requisição.");
    }
  }
    }
  }

  // 🔹 Editar produto
  function handleEditar(produto) {
    setNovoProduto(produto);
    setIdEdicao(produto.id);
    setMensagemErro(""); // Limpa erros ao clicar em editar
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
        console.error("Erro ao remover produto:", err);
        alert("Erro ao remover produto.");
      }
    }
  }

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-8">
      <Header />

      {/* 3. NOVO: Exibir o erro na tela se ele existir */}
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