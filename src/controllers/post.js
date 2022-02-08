const { idToInteger, prisma } = require('../utils');

const getPost = async (req, res) => {
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

const getPostByUser = async (req, res) => {
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
    const id = idToInteger(req.params);
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

const handleUpdateComment = async (req, res) => {
    const id = idToInteger(req.params);
    const { content } = req.body;

    const updatedComment = updateComment(id, content);

    return res.json(updatedComment);
};

const updateComment = async (id, content) => {
    const updatedComment = await prisma.comment.update({
        where: {
            id,
        },
        data: {
            content,
        },
    });
    return updatedComment;
};

const updateCategory = async (req, res) => {
    const id = idToInteger(req.params);
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

    let post = {};

    if (title) post = { ...post, title };
    if (content) post = { ...post, content };
    if (imgUrl) post = { ...post, imgUrl };

    return post;
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

const deletePost = async (req, res) => {
    const id = idToInteger(req.params);

    const deletedPost = await prisma.post.delete({
        where: {
            id,
        },
    });

    res.json(deletedPost);
};

const handleDeleteComment = async (req, res) => {
    const id = idToInteger(req.params);

    const targetComment = await getCommentById(id);

    let parentId;

    if (targetComment) parentId = targetComment.parentId;
    if (!targetComment) return res.status(404).send('comment not found');

    let deletedComment;

    if (parentId) {
        deletedComment = await deleteComment(id);
    } else {
        deletedComment = await deleteParentComment(id);
    }

    res.json(deletedComment);
};

const deleteComment = async (id) => {
    return await prisma.comment.delete({
        where: {
            id,
        },
    });
};

const getCommentById = async (id) => {
    const comment = await prisma.comment.findUnique({
        where: {
            id,
        },
    });
    return comment;
};

const deleteParentComment = async (id) => {
    const comment = await prisma.comment.findMany({
        where: {
            parentId: id,
        },
    });

    if (comment.length > 0) {
        return updateComment(id, `[removed]`);
    } else {
        return await deleteComment(id);
    }
};

module.exports = {
    getPost,
    getPostByUser,
    createPost,
    createComment,
    updatePost,
    handleUpdateComment,
    updateCategory,
    deletePost,
    handleDeleteComment,
};
