
import { PrismaClient, Prisma } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
require('dotenv').config();

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool as any);
const prisma = new PrismaClient({ adapter });

async function debugSearch(search: string) {
  console.log(`Searching for: "${search}"`);
  const searchTerm = `%${search}%`;
  
  try {
    const query = Prisma.sql`
      SELECT s.id, s.title, s.tags,
             CASE 
               WHEN s."title" ILIKE ${search} THEN 100
               WHEN ${search} = ANY(s."tags") THEN 80
               WHEN s."title" ILIKE ${search + '%'} THEN 70
               WHEN s."title" ILIKE ${searchTerm} THEN 50
               ELSE 0
             END as relevance_score
      FROM "Service" s
      WHERE s."isActive" = true
      AND (
        s."title" ILIKE ${searchTerm} 
        OR s."description" ILIKE ${searchTerm} 
        OR s."slug" ILIKE ${searchTerm} 
        OR ${search} = ANY(s."tags")
        OR EXISTS (SELECT 1 FROM unnest(s."tags") t WHERE t ILIKE ${searchTerm})
      )
      ORDER BY relevance_score DESC
    `;

    const items: any[] = await prisma.$queryRaw(query);
    console.log(`Found ${items.length} items.`);
    items.forEach(i => console.log(` - [Score: ${i.relevance_score}] ${i.title} (Tags: ${i.tags.join(', ')})`));
  } catch (e) {
    console.error('Search failed:', e);
  } finally {
    await prisma.$disconnect();
    await pool.end();
  }
}

const term = process.argv[2] || 'yoga';
debugSearch(term);
