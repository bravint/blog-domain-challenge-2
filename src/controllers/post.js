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
                                where: { name: category.name },
                                create: { name: category.name },
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
                    profile: true,
                },
            },
            categories: true,
        },
    });
    return res.json(createdPost);
};

const createComment = async (req, res) => {
    const { parentId, content, userId, postId } = req.body;

    let data = {
        content,
    };

    if (parentId) data = { ...data, parentId };

    const createdComment = await prisma.comment.create({
        data: {
            ...data,
            user: {
                connect: {
                    id: userId,
                },
            },
            post: {
                connect: {
                    id: postId,
                },
            },
        },
    });
    console.log(`createdComment`, createdComment);
    return res.json(createdComment);
};

module.exports = {
    createPost,
    createComment,
};
