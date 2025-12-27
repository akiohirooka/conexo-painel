import { PrismaClient } from '../prisma/generated/client'

const prisma = new PrismaClient()

async function main() {
    console.log('Verifying columns in database...')

    const tables = ['businesses', 'events', 'jobs']

    for (const table of tables) {
        const columns = await prisma.$queryRaw`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = ${table} 
      AND column_name IN ('contacts_data', 'opening_hours');
    `
        console.log(`\nTable: ${table}`)
        if (Array.isArray(columns) && columns.length > 0) {
            columns.forEach((col: any) => {
                console.log(` - ${col.column_name}: ${col.data_type}`)
            })
        } else {
            console.log(' - No matching columns found.')
        }
    }
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
