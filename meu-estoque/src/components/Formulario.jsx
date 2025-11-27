import { DollarSign, Edit, Package, Plus, Save, Tag, X } from "lucide-react";

export default function Formulario({ novoProduto, handleInputChange, handleSalvar, handleCancelar, idEdicao }) {
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

        {/* Nome */}
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

        {/* Preço */}
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

        {/* Categoria */}
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

        {/* Quantidade */}
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

        {/* Botões */}
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
}
