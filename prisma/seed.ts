import { PrismaClient } from '@prisma/client';
const db = new PrismaClient();

async function seed() {
  const john = await db.user.create({
    data: {
      username: 'John',
      // Password = twixrox
      passwordHash:
        '$2b$10$K7L1OJ45/4Y2nIvhRVpCe.FSmhDdWoXehVzJptJ/op0lSsvqNu/1u',
    },
  });

  await Promise.all(
    getPosts().map((post) => {
      return db.post.create({ data: { userId: john.id, ...post } });
    })
  );
}

seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });

function getPosts() {
  return [
    {
      title: 'JavaScript Performance Tips',
      body: `We will look at 10 simple tips and tricks to increase the speed of your code when writing JS`,
      slug: 'javascript-performance-tips',
    },
    {
      title: 'Tailwind vs Bootstrap',
      body: `Both Tailwind and Bootstrap are very popular CSS frameworks. In this article, we will compare them`,
      slug: 'tailwind-vs-bootstrap',
    },
    {
      title: 'Writing Great Unit Tests',
      body: `We will look at 10 simple tips and tricks on writing unit tests in JavaScript`,
      slug: 'writing-great-unit-tests',
    },
    {
      title: 'What Is New In PHP 8?',
      body: `In this article we will look at some of the new features offered in version 8 of PHP`,
      slug: 'what-is-new-in-php-8',
    },
  ];
}