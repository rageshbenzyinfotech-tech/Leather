const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@zerano.com' },
    update: {},
    create: {
      name: 'Admin',
      email: 'admin@zerano.com',
      password_hash: adminPassword,
      role: 'ADMIN',
    },
  });
  console.log('✅ Admin user created:', admin.email);

  // Create test customer
  const userPassword = await bcrypt.hash('user123', 10);
  const user = await prisma.user.upsert({
    where: { email: 'customer@zerano.com' },
    update: {},
    create: {
      name: 'Test Customer',
      email: 'customer@zerano.com',
      password_hash: userPassword,
      role: 'USER',
    },
  });
  console.log('✅ Test user created:', user.email);

  // Create Products
  const productsData = [
    {
      name: 'Essential Slim Wallet',
      slug: 'essential-slim-wallet',
      description: 'A minimalist wallet designed for your essentials. Handcrafted from premium full-grain leather.',
      price: 65,
      discount_price: null,
      stock: 50,
      category: 'wallets',
      images: [
        'https://images.unsplash.com/photo-1627123424574-724758594e93?q=80&w=600&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1627123424574-724758594e93?q=80&w=400&auto=format&fit=crop'
      ],
      is_active: true,
    },
    {
      name: 'The Weekender',
      slug: 'the-weekender',
      description: 'The perfect companion for a short getaway. Features durable leather and brass hardware.',
      price: 345,
      discount_price: 299,
      stock: 20,
      category: 'bags',
      images: [
        'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?q=80&w=600&auto=format&fit=crop'
      ],
      is_active: true,
    },
    {
      name: 'Classic Leather Belt',
      slug: 'classic-leather-belt',
      description: 'A versatile belt that ages beautifully. Made with 100% thick, vegetable-tanned leather.',
      price: 85,
      discount_price: null,
      stock: 100,
      category: 'belts',
      images: [
        'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=600&auto=format&fit=crop'
      ],
      is_active: true,
    },
    {
      name: 'Minimalist Cardholder',
      slug: 'minimalist-cardholder',
      description: 'When less is more. Carries up to 6 cards perfectly.',
      price: 45,
      discount_price: 39,
      stock: 75,
      category: 'wallets',
      images: [
        'https://images.unsplash.com/photo-1628149462153-29ecda955685?q=80&w=600&auto=format&fit=crop'
      ],
      is_active: true,
    },
    {
      name: 'Everyday Tote Bag',
      slug: 'everyday-tote',
      description: 'A spacious, hands-free tote made from soft, full-grain leather. Perfect for daily commutes.',
      price: 195,
      discount_price: null,
      stock: 30,
      category: 'bags',
      images: [
        'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=600&auto=format&fit=crop'
      ],
      is_active: true,
    },
    {
      name: 'Signature Belt',
      slug: 'signature-belt',
      description: 'Our signature reversible belt features a sleek silver buckle and two-tone design.',
      price: 95,
      discount_price: null,
      stock: 60,
      category: 'belts',
      images: [
        'https://images.unsplash.com/photo-1624823183572-c515a81e3a95?q=80&w=600&auto=format&fit=crop'
      ],
      is_active: true,
    },
    {
      name: 'Passport Cover',
      slug: 'passport-cover',
      description: 'Travel in style. This cover protects your passport while looking impeccably refined.',
      price: 55,
      discount_price: null,
      stock: 45,
      category: 'accessories',
      images: [
        'https://images.unsplash.com/photo-1579758629938-03607fc1ce5b?q=80&w=600&auto=format&fit=crop'
      ],
      is_active: true,
    },
    {
      name: 'Key Organizer',
      slug: 'key-organizer',
      description: 'Stop the jingle. Organize your keys with this sleek, compact leather organizer.',
      price: 35,
      discount_price: null,
      stock: 80,
      category: 'accessories',
      images: [
        'https://images.unsplash.com/photo-1520006403909-838d6b92c22e?q=80&w=600&auto=format&fit=crop'
      ],
      is_active: true,
    },
  ];

  for (const product of productsData) {
    await prisma.product.upsert({
      where: { slug: product.slug },
      update: product,
      create: product,
    });
  }
  console.log(`✅ ${productsData.length} products seeded`);

  console.log('\n🎉 Seed complete!');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('Admin login:  admin@zerano.com / admin123');
  console.log('User login:   customer@zerano.com / user123');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
