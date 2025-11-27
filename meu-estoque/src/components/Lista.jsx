import { Edit, Trash2 } from "lucide-react";

export default function Lista({ produtos, busca, setBusca, handleEditar, handleRemover, idEdicao }) {

  const categorias = [...new Set(produtos.map(p => p.categoria))];

  return (
    <div className="space-y-6">
      {/* Barra de busca */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center gap-2">
        <input
          type="text"
          placeholder="Buscar produto..."
          className="w-full outline-none text-gray-700"
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
        />
      </div>

      {/* Produtos agrupados por categoria */}
      {categorias.map(categoria => {
        const produtosFiltrados = produtos
          .filter(p => p.categoria === categoria && p.nome.toLowerCase().includes(busca.toLowerCase()));

        if (produtosFiltrados.length === 0) return null;

        return (
          <div key={categoria} className="space-y-3">
            <h2 className="text-xl font-bold text-gray-700">{categoria}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {produtosFiltrados.map(produto => (
                <div key={produto.id} className={`p-4 rounded-xl shadow-sm border flex justify-between items-center group transition
                  ${idEdicao === produto.id ? 'bg-yellow-50 border-yellow-300 scale-[1.01]' : 'bg-white border-gray-100 hover:shadow-md'}
                `}>
                  <div>
                    <h3 className="font-bold text-gray-800">{produto.nome}</h3>
                    <div className="text-sm text-gray-500">
                      Preço: R$ {produto.preco.toFixed(2)} | Quantidade: {produto.quantidade}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button onClick={() => handleEditar(produto)} className="text-yellow-500 hover:bg-yellow-50 p-2 rounded-lg transition">
                      <Edit size={18} />
                    </button>
                    <button onClick={() => handleRemover(produto.id)} className="text-red-400 hover:bg-red-50 p-2 rounded-lg transition">
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
