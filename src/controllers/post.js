const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const getPosts = async (req, res) => {
    let queryFilters = {};
    queryFilters = generateQueryFilters(req.query);

    const postsFetched = await prisma.post.findMany({
        ...queryFilters,
        include: {
            categories: true,
            comment: true,
        }
    });

    return res.json(postsFetched);
};

const getPostsByUser = async (req, res) => {
    let { user } = req.params;

    let queryFilters = {};
    queryFilters = generateQueryFilters(req.query);

    let name;
    let id;

    isNaN(parseInt(user, 10)) ? (name = user) : (id = user);

    id = parseInt(id, 10);

    let paramFilters;
    if (name) paramFilters = { userId: await getUserId(name) };
    if (id) paramFilters = { userId: id };

    const postsFetched = await prisma.post.findMany({
        ...queryFilters,
        where: {
            ...paramFilters,
        },
        include: {
            categories: true,
            comment: true,
        }
    });

    return res.json(postsFetched);
};

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

    return res.json(createdComment);
};

const generateQueryFilters = (query) => {
    let { limit, orderBy } = query;

    let queryFilters = {};

    if (limit) {
        limit = parseInt(limit, 10);
        queryFilters = { ...queryFilters, take: limit };
    }

    if (orderBy) queryFilters = { ...queryFilters, orderBy: { id: orderBy } };

    return queryFilters;
};

const getUserId = async (name) => {
    const user = await prisma.user.findUnique({
        where: {
            username: name,
        },
    });
    
    return user.id;
};

module.exports = {
    getPosts,
    getPostsByUser,
    createPost,
    createComment,
    updatePost,
    updateComment,
};
