import axios from "axios";
import { useEffect, useState } from "react";
import Formulario from "./components/Formulario";
import Header from "./components/Header";
import Lista from "./components/Lista";

const api = "http://localhost:8080/api/produtos"; // URL do backend

export default function App() {
  const [produtos, setProdutos] = useState([]);
  const [busca, setBusca] = useState("");
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
    }
  }

  useEffect(() => {
    carregarProdutos();
  }, []);

  // 🔹 Atualizar campos do formulário
  function handleInputChange(e) {
    const { name, value } = e.target;
    setNovoProduto({
      ...novoProduto,
      [name]: name === "preco" || name === "quantidade" ? Number(value) : value
    });
  }

  // 🔹 Salvar produto

  async function handleSalvar(e) {
  e.preventDefault();
  if (!novoProduto.nome || !novoProduto.preco || !novoProduto.categoria || !novoProduto.quantidade) {
    alert("Preencha todos os campos!");
    return;
  }

  try {
    if (idEdicao) {
      await axios.put(`${api}/${idEdicao}`, novoProduto);
    } else {
      await axios.post(api, novoProduto);
    }
    await carregarProdutos(); // atualiza a lista
    setNovoProduto({ nome: "", preco: 0, categoria: "", quantidade: 1 });
    setIdEdicao(null);
  } catch (err) {
    console.error("Erro ao salvar produto:", err);
    alert("Erro ao salvar produto. Veja o console.");
  }
}

  // 🔹 Editar produto
  function handleEditar(produto) {
    setNovoProduto(produto);
    setIdEdicao(produto.id);
  }

  // 🔹 Cancelar edição
  function handleCancelar() {
    setNovoProduto({ nome: "", preco: 0, categoria: "", quantidade: 1 });
    setIdEdicao(null);
  }

  // 🔹 Remover produto
  async function handleRemover(id) {
    if (confirm("Tem certeza que deseja remover?")) {
      try {
        await axios.delete(`${api}/${id}`);
        await carregarProdutos();
      } catch (err) {
        console.error("Erro ao remover produto:", err);
        alert("Erro ao remover produto. Veja o console.");
      }
    }
  }

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-8">
      <Header />

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
