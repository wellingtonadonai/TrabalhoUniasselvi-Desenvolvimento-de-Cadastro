import { Package } from "lucide-react";

export default function Header() {
  return (
    <header className="mb-8 text-center md:text-left">
      <h1 className="text-3xl font-bold text-blue-700 flex items-center justify-center md:justify-start gap-2">
        <Package size={32} />
        Gerenciador de Estoque
      </h1>
      <p className="text-gray-500 mt-2">Trabalho de extensão uniasselvi (Spring Boot + React e Vite)</p>
    </header>
  );
}
