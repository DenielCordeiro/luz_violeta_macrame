import { Product } from "../interfaces/product.interface";

export const PRODUCTS_MOCK: Product[] = [
  {
    _id: "65a1b2c3d4e5f6g7h8i9j001",
    name: "Painel Macramê Boho Chic",
    description: "Painel decorativo grande feito com cordão de algodão cru e galho natural.",
    valor: 250.00,
    category: "Decoração de Parede",
    type: "Raízes",
    file: {
      name: "painel-boho.jpg",
      size: 102450,
      url: "https://picsum.photos/seed/painel/800/600",
      createdAt: { default: new Date("2024-01-10T10:00:00Z") }
    }
  },
  {
    _id: "65a1b2c3d4e5f6g7h8i9j002",
    name: "Suporte de Planta Suspenso",
    description: "Suporte reforçado para vasos médios com detalhes em madeira.",
    valor: 45.90,
    category: "Jardim",
    type: "Urban Jungle",
    file: {
      name: "suporte-planta.jpg",
      size: 85000,
      url: "https://picsum.photos/seed/planta/800/600",
      createdAt: { default: new Date("2024-01-15T14:30:00Z") }
    }
  },
  {
    _id: "65a1b2c3d4e5f6g7h8i9j003",
    name: "Bolsa de Ombro em Macramê",
    description: "Bolsa artesanal com forro de linho e alças resistentes.",
    valor: 180.00,
    category: "Acessórios",
    type: "Verão 2024",
    file: {
      name: "bolsa-macrame.jpg",
      size: 120000,
      url: "https://picsum.photos/seed/bolsa/800/600",
      createdAt: { default: new Date("2024-02-01T09:15:00Z") }
    }
  },
  {
    _id: "65a1b2c3d4e5f6g7h8i9j004",
    name: "Luminária Pendente Trama",
    description: "Cúpula para luminária feita em técnica de macro macramê.",
    valor: 320.00,
    category: "Iluminação",
    type: "Luz Violeta",
    file: {
      name: "luminaria.jpg",
      size: 200000,
      url: "https://picsum.photos/seed/luz/800/600",
      createdAt: { default: new Date("2024-02-10T18:00:00Z") }
    }
  },
  {
    _id: "65a1b2c3d4e5f6g7h8i9j005",
    name: "Caminho de Mesa Elegance",
    description: "Caminho de mesa com franjas longas para mesas de até 6 lugares.",
    valor: 140.00,
    category: "Mesa Posta",
    type: "Clássicos",
    file: {
      name: "caminho-mesa.jpg",
      size: 98000,
      url: "https://picsum.photos/seed/mesa/800/600",
      createdAt: { default: new Date("2024-02-15T11:20:00Z") }
    }
  },
  {
    _id: "65a1b2c3d4e5f6g7h8i9j006",
    name: "Chaveiro Folha Boho",
    description: "Kit com 3 chaveiros em formato de folha de macramê.",
    valor: 35.00,
    category: "Acessórios",
    type: "Mimos",
    file: {
      name: "chaveiros.jpg",
      size: 45000,
      url: "https://picsum.photos/seed/folha/800/600",
      createdAt: { default: new Date("2024-03-01T08:45:00Z") }
    }
  },
  {
    _id: "65a1b2c3d4e5f6g7h8i9j007",
    name: "Espelho Decorativo Sol",
    description: "Moldura em macramê para espelho circular.",
    valor: 110.00,
    category: "Decoração de Parede",
    type: "Raízes",
    file: {
      name: "espelho.jpg",
      size: 135000,
      url: "https://picsum.photos/seed/espelho/800/600",
      createdAt: { default: new Date("2024-03-05T15:10:00Z") }
    }
  },
  {
    _id: "65a1b2c3d4e5f6g7h8i9j008",
    name: "Cortina Divisória de Ambientes",
    description: "Cortina em macramê ideal para separar ambientes com leveza.",
    valor: 450.00,
    category: "Decoração",
    type: "Macro Macramê",
    file: {
      name: "cortina.jpg",
      size: 350000,
      url: "https://picsum.photos/seed/cortina/800/600",
      createdAt: { default: new Date("2024-03-12T13:00:00Z") }
    }
  },
  {
    _id: "65a1b2c3d4e5f6g7h8i9j009",
    name: "Cesto Organizador Trama",
    description: "Cesto estruturado para mantas ou brinquedos.",
    valor: 195.00,
    category: "Organização",
    type: "Luz Violeta",
    file: {
      name: "cesto.jpg",
      size: 180000,
      url: "https://picsum.photos/seed/cesto/800/600",
      createdAt: { default: new Date("2024-03-20T10:30:00Z") }
    }
  },
  {
    _id: "65a1b2c3d4e5f6g7h8i9j010",
    name: "Almofada Nó Celta",
    description: "Capa de almofada com trabalho frontal em nós complexos.",
    valor: 85.00,
    category: "Decoração",
    type: "Conforto",
    file: {
      name: "almofada.jpg",
      size: 92000,
      url: "https://picsum.photos/seed/almofada/800/600",
      createdAt: { default: new Date("2024-03-25T16:50:00Z") }
    }
  }
];