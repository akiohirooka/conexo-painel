
import { PrismaClient } from '../prisma/generated/client'

const prisma = new PrismaClient()

async function main() {
    try {
        console.log('Checking columns in "events" table...')

        // We can use a raw query to check the columns in postgres
        const result = await prisma.$queryRaw`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'events'
      ORDER BY column_name;
    `

        console.log('Columns found:', result)
    } catch (e) {
        console.error('Error querying database:', e)
    } finally {
        await prisma.$disconnect()
    }
}

main()
