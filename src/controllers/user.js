const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const createUser = async (req, res) => {
    const { username, email, password, firstName, lastName, age, pictureUrl } =
        req.body;

    const createdUser = await prisma.user.create({
        data: {
            username,
            email,
            password,
            profile: {
                create: {
                    firstName,
                    lastName,
                    age,
                    pictureUrl,
                },
            },
        },
        include: { profile: true },
    });
    return res.json(createdUser);
};

const updateUser = async (req, res) => {
    let { id } = req.params;
    const { username, email, password, firstName, lastName, age, pictureUrl } =
        req.body;

    id = parseInt(id, 10);

    const updateUser = await prisma.user.update({
        where: { 
            id: id
        },
        data: {
            username,
            email,
            password,
            profile: {
                update: {
                    firstName,
                    lastName,
                    age,
                    pictureUrl,
                } 
            },
        },
        include: { 
            profile: true 
        },
    });
    return res.json(updateUser);
};

module.exports = {
    createUser,
    updateUser,
};
