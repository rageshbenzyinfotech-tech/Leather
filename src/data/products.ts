export interface Product {
  id: string;
  title: string;
  price: number;
  image: string;
  colors?: string[];
  category: string;
  description?: string;
}

export const products: Product[] = [
  {
    id: 'essential-slim-wallet',
    title: 'Essential Slim Wallet',
    price: 65,
    image: 'https://images.unsplash.com/photo-1627123424574-724758594e93?q=80&w=600&auto=format&fit=crop',
    colors: ['black', 'brown', 'tan'],
    category: 'wallets',
    description: 'A minimalist wallet designed for your essentials. Handcrafted from premium full-grain leather.'
  },
  {
    id: 'the-weekender',
    title: 'The Weekender',
    price: 345,
    image: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?q=80&w=600&auto=format&fit=crop',
    colors: ['brown', 'black'],
    category: 'bags',
    description: 'The perfect companion for a short getaway. Features durable leather and brass hardware.'
  },
  {
    id: 'classic-leather-belt',
    title: 'Classic Leather Belt',
    price: 85,
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=600&auto=format&fit=crop',
    colors: ['black', 'tan'],
    category: 'belts',
    description: 'A versatile belt that ages beautifully. Made with 100% thick, vegetable-tanned leather.'
  },
  {
    id: 'minimalist-cardholder',
    title: 'Minimalist Cardholder',
    price: 45,
    image: 'https://images.unsplash.com/photo-1628149462153-29ecda955685?q=80&w=600&auto=format&fit=crop',
    colors: ['tan', 'black', 'maroon', 'dual'],
    category: 'wallets',
    description: 'When less is more. Carries up to 6 cards perfectly.'
  }
];
