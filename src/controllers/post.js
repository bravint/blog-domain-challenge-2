const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const createPost = async (req, res) => {
    const { categories, title, content, imgUrl, userId } = req.body;

    const createdPost = await prisma.post.create({
        data: {
            title,
            content,
            imgUrl,
            user: {
                connect: {
                    id: userId,
                },
            },
            categories: {
                create: categories.map((category) => {
                    return {
                        category: {
                            connectOrCreate: {
                                where: {name: category.name},
                                create: {name: category.name}
                            },
                        },
                    };
                }),
            },
        },
        include: {
            user: true,
            user: {
                include: {
                    profile: true
                }
            },
            categories: true,
        },
    });
    return res.json(createdPost);
};

module.exports = {
    createPost,
};
