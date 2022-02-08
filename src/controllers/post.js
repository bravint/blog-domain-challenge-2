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
        },
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
        },
    });

    return res.json(postsFetched);
};

const createPost = async (req, res) => {
    const { categories, userId } = req.body;

    const post = generatePost(req.body);

    const createdPost = await prisma.post.create({
        data: {
            ...post,
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

const updatePost = async (req, res) => {
    const { id } = idToInteger(req.params);
    let { categories, categoriesToRemove } = req.body;

    const post = generatePost(req.body);

    !categories ? (categories = []) : categories;

    if (categoriesToRemove)
        await removeCategoryFromPost(categoriesToRemove, id);

    const updatedPost = await prisma.post.update({
        where: {
            id,
        },
        data: {
            ...post,
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

    return res.json(updatedPost);
};

const updateComment = async (req, res) => {
    const { id } = idToInteger(req.params);
    const { content } = req.body;

    const updatedComment = await prisma.comment.update({
        where: {
            id,
        },
        data: {
            content,
        },
    });
    return res.json(updatedComment);
};

const updateCategory = async (req, res) => {
    const { id } = idToInteger(req.params);
    const { name } = req.body;

    const updatedCategory = await prisma.comment.update({
        where: {
            id,
        },
        data: {
            name,
        },
    });
    return res.json(updatedCategory);
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

const getUserId = async (username) => {
    const user = await prisma.user.findUnique({
        where: {
            username,
        },
    });

    return user.id;
};

const generatePost = (requestBody) => {
    const { title, content, imgUrl } = requestBody;

    const post = { title, content, imgUrl };

    return post;
};

const idToInteger = (params) => {
    const { id } = params;

    return parseInt(id, 10);
};

const removeCategoryFromPost = async (categoriesToRemove, id) => {
    await prisma.post.update({
        where: {
            id,
        },
        data: {
            categories: {
                deleteMany: categoriesToRemove.map((category) => {
                    return {
                        categoryId: parseInt(category.id, 10),
                    };
                }),
            },
        },
    });
};

module.exports = {
    getPosts,
    getPostsByUser,
    createPost,
    createComment,
    updatePost,
    updateComment,
    updateCategory,
};
