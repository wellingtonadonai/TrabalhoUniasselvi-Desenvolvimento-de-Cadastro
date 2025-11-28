import { Lock, LogIn, User } from "lucide-react";
import { useState } from "react";

export default function Login({ onLogin }) {
  // Estados para guardar o que o usuário digita
  const [login, setLogin] = useState("");
  const [senha, setSenha] = useState("");
  
  // Estado para mensagem de erro (vermelha) e carregando (botão desabilitado)
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);

  // Função disparada quando clica em "Entrar"
  const handleSubmit = async (e) => {
    e.preventDefault(); // Evita que a página recarregue
    setErro("");
    setCarregando(true); // Trava o botão

    try {
      // Chama a função handleLogin que está lá no App.jsx
      await onLogin(login, senha);
    } catch (msg) {
      // Se der erro lá no App.jsx (403 ou conexão), cai aqui
      setErro("Usuário ou senha incorretos!");
      setCarregando(false); // Destrava o botão para tentar de novo
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-gray-200">
        
        {/* Cabeçalho do Card */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-blue-600 mb-2">Bem-vindo</h1>
          <p className="text-gray-500">Faça login para gerenciar o estoque</p>
        </div>

        {/* Mensagem de Erro (Só aparece se tiver erro) */}
        {erro && (
          <div className="bg-red-100 text-red-700 p-3 rounded-lg mb-4 text-sm text-center font-medium border border-red-200">
            {erro}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Campo Usuário */}
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

          {/* Campo Senha */}
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

          {/* Botão Entrar */}
          <button
            type="submit"
            disabled={carregando}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg shadow-lg flex items-center justify-center gap-2 transition duration-200 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {carregando ? (
              "Verificando..."
            ) : (
              <>
                <LogIn size={20} /> Entrar no Sistema
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}