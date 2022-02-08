const { idToInteger, prisma } = require('../utils');

const createUser = async (req, res) => {
    const user = generateUser(req.body);
    const profile = generateProfile(req.body);

    const createdUser = await prisma.user.create({
        data: {
            ...user,
            profile: {
                create: {
                    ...profile,
                },
            },
        },
        include: {
            profile: true,
        },
    });

    return res.json(createdUser);
};

const updateUser = async (req, res) => {
    const id = idToInteger(req.params);

    const user = generateUser(req.body);
    const profile = generateProfile(req.body);

    const updatedUser = await prisma.user.update({
        where: {
            id,
        },
        data: {
            ...user,
            profile: {
                update: {
                    ...profile,
                },
            },
        },
        include: {
            profile: true,
        },
    });

    return res.json(updatedUser);
};

const updateProfile = async (req, res) => {
    const id = idToInteger(req.params);

    const profile = generateProfile(req.body);

    const updatedProfile = await prisma.profile.update({
        where: {
            id,
        },
        data: {
            ...profile,
        },
    });

    return res.json(updatedProfile);
};

const generateUser = (requestBody) => {
    const { username, email, password } = requestBody;

    const user = {
        username,
        password,
        email,
    };

    return user;
};

const generateProfile = (requestBody) => {
    const { firstName, lastName, age, pictureUrl } = requestBody;

    const profile = {
        firstName,
        lastName,
        age,
        pictureUrl,
    };

    return profile;
};

const deleteUser = async (req, res) => {
    const id = idToInteger(req.params);

    const deletedUser = await prisma.user.delete({
        where: {
            id,
        },
    });

    return res.json(deletedUser);
};

module.exports = {
    createUser,
    updateUser,
    updateProfile,
    deleteUser,
};
