const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const createUser = async (req, res) => {
    console.log(req.body, req.params);
    const createdUser = await prisma.user.create({
        data: {
            username: req.body.username,
            email: req.body.email,
            password: req.body.password,
            profile: {
                create: {
                    firstName: req.body.firstName,
                    lastName: req.body.lastName,
                    age: req.body.age,
                    pictureUrl: req.body.pictureUrl,
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
