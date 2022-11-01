const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

exports.handler = async (event, context, callback) => {
  try {
    const deleteupsell = await prisma.upsell.delete({
        where: {
          id: event.id,
        },
      })
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body:JSON.stringify([deleteupsell])
    }
  } catch (error) {
    console.error(error)
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(error)
    }
  }
}