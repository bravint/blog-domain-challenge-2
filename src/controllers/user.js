const {PrismaClient} = require('@prisma/client');

const prisma = new PrismaClient();

const createUser = async (req, res) => {
    console.log(req.body, req.params)
    // createdUser = await prisma.user.create({

    // })
    return res.status(200). res.json('route OK')
}

module.exports = {
    createUser
}