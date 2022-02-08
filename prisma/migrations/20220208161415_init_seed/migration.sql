-- DropForeignKey
ALTER TABLE "CategoriesonPosts" DROP CONSTRAINT "CategoriesonPosts_categoryId_fkey";

-- DropForeignKey
ALTER TABLE "CategoriesonPosts" DROP CONSTRAINT "CategoriesonPosts_postId_fkey";

-- AddForeignKey
ALTER TABLE "CategoriesonPosts" ADD CONSTRAINT "CategoriesonPosts_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CategoriesonPosts" ADD CONSTRAINT "CategoriesonPosts_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE CASCADE ON UPDATE CASCADE;
