const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

exports.handler = async (event, context, callback) => {
  console.info("EVENT\n" + JSON.stringify(event, null, 2))
  console.warn("Event not processed.")
  // try {
    // const data = {
    //   priority: 12,
    //   conversion: 10,
    //   userId: 2,
    //   status: true,
    //   views: 1,
    //   conversion: 2,
    //   priority: 12,
    //   triggers: { data: "12" },
    //   content: { title: "ready for sell" },
    // };
    const res = await prisma.upsell.create({
      data: {
        priority: 12,
        conversion: 10,
        userId: 2,
        status: true,
        views: 1,
        triggers: { data: "12" },
        content: { title: "ready for sell" },
      }
    });
    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body:JSON.stringify([res])
    };
  // } catch (err) {
  //   return {error:true}
  // } finally {
  //   async () => {
  //     await prisma.$disconnect();
  //   };
  // }
};

// const {
//   Prisma,
//   PrismaClient
// } = require('@prisma/client')
// const prisma = new PrismaClient()

// exports.handler = async (event, context, callback) => {
//   try {
//     const data = JSON.parse({
//       'priority': 12,
//       'conversion':10
//     })
//     // const createdUpsell = await prisma.Upsell.create(data)
//     const createdUser = await prisma.Upsell.create({
//       data: data,
//     })
//     return {
//       statusCode: 201,
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({user:createdUser}),
//     }
//   } catch (error) {
//     console.error(error)
//     return { statusCode: 500 }
//   }

//     return {
//       statusCode: 200,
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify(createdUpsell)
//     }
//   } catch (e) {
//     console.log(e)
// if (e instanceof Prisma.PrismaClientKnownRequestError ) {
//   if (e.code === 'P2002') {
//     return {
//       statusCode: 409,
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({
//         error: 'A user with this email already exists'
//       })
//     }
//   }
// }

// }
// }
