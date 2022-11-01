const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

exports.handler = async (event, context, callback) => {
  // const request = JSON.parse(event.body);
  // console.info("EVENT\n" + JSON.stringify(event))
  try {
    const updateupsell = await prisma.upsell.update({
        where: {
          id: event.id,
        },
        data: {
          priority: request.priority,
          conversion: request.conversion,
        },
      })
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify([updateupsell])
    }
  } catch (error) {
    console.error(error)
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify([error])
    }
  }
}