const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const createUser = async (req, res) => {
    const {username, email, password, firstName, lastName, age, pictureUrl} = req.body;

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
        include: {profile: true}
    });
    return res.json(createdUser);
};

module.exports = {
    createUser,
};
