const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const seed = async () => {
    const user = await createUser();
    await createProfile(user);
    const categories = await createCategory();
    const posts = await createPost(categories, user);
    await createComment(user, posts)
};

const createUser = async () => {
    const createdUser = await prisma.user.create({
        data: {
            username: 'Brave',
            email: 'brave@mail.com',
            password: 'niceTry',
        },
    });
    
    console.log(`createdUser`, createdUser);

    return createdUser;
};

const createProfile = async (user) => {
    const createdProfile = await prisma.profile.create({
        data: {
            firstName: 'Bravin',
            lastName: 'Thillainathan',
            age: 34,
            pictureUrl: 'http://yourUrlHere/picture.png',
            user: {
                connect: {
                    id: user.id,
                },
            },
        },
    });

    console.log(`createdProfile`, createdProfile);

    return createdProfile;
};

const createCategory = async () => {
    const categoriesToCreate = ['catA', 'catB', 'catC', 'catD', 'catE'];
    
    let categories = [];

    for (let i = 0; i < categoriesToCreate.length; i++) {
        
        const createdCategory = await prisma.category.create({
            data: {
                name: categoriesToCreate[i],
            },
        });
        categories.push(createdCategory);
    }

    console.log(`createdCategories`, categories);

    return categories;
};

const createPost = async (categories, user) => {
    const postsToCreate = ['postA', 'postB', 'postC', 'postD', 'postE'];
    let posts = [];
    for (let i = 0; i < postsToCreate.length; i++) {
        const createdPost = await prisma.post.create({
            data: {
                title: postsToCreate[i],
                content: postsToCreate[i],
                imgUrl: 'http://yourUrlHere/picture.png',
                user: {
                    connect: {
                        id: user.id,
                    },
                },
                categories: {
                    create: [
                        {
                            category: {
                                connect: {
                                    id: categories[i].id,
                                },
                            },
                        },
                    ],
                },
            },
        });
        console.log(createdPost)
        posts.push(createdPost);
    }
    console.log(`createdPosts`, posts);
    return posts;
};

const createComment = async (user, posts) => {
    const createdComment = await prisma.comment.create({
        data: {
            content: `hello world, I'm replying to a post`,
            user: {
                connect: {
                    id: user.id
                }
            },
            post: {
                connect: {
                    id: posts[0].id
                }
            }
        }
    })
    console.log(`createdComment`, createdComment);
    return createdComment;
};

seed()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
