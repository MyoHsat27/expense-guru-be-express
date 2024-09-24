import Category from "../../models/category";
import { transformToObjectId } from "../../helpers/helper";
import { CategoryCreateOject } from "../../types/category";

export const CategoryService = () => {
    const create = (category: CategoryCreateOject) => {
        const newCategory = new Category(category)
        return newCategory;
    }

    const save = async (category: CategoryCreateOject) => {
        await existingCategory(category.userId, category.name);
        const createdCategory = create(category);
        const savedCategory = createdCategory.save()
        return savedCategory;
    }

    const existingCategory = async (userId: string, categoryName: string) => {
        const categories = await Category.find({
            name: categoryName,
            userId: { $in: [userId, null] }
        });
        if (categories.length > 0) {
            throw new Error("Category already exists.");
        }
    }

    const getAllCategories = async (user_id: string) => {
        try {
            const categories = await Category.find({userId: user_id});
            return categories;
        } catch (error: any) {
            throw new Error("Failed to retrieve categories: " + error.message);
        }
    };

    const updateCategory = async (id: string, body: Record<string, string>) => {
        try {
            const updatedCategory = await Category.findByIdAndUpdate(id, body, { new: true })
            if (!updatedCategory) {
                throw new Error('Category not found.');
            }
            return updatedCategory
        } catch (error: any) {
            throw new Error(`Error updating category: ${error.message}`);
        }
    }

    const findById = async (id: string) => {
        const objectId = transformToObjectId(id, "category not found!")
        const category = await Category.findById(objectId);

        if (!category) {
            throw new Error("Category not found!")
        }
        return category;
    }

    const deleteCategory = async (id: string, body: Record<string, string>) => {
        try {
            const category = await findById(id);
            const userId = transformToObjectId(body.userId, "user not found")
            if (!category.userId && !userId.equals(category.userId)) {
                throw new Error("Can't delete other user's and system category")
            }
            await Category.findOneAndDelete({ _id: id });
        } catch (error: any) {
            throw new Error(error.message)
        }
    }
    return {
        create,
        save,
        existingCategory,
        getAllCategories,
        updateCategory,
        findById,
        deleteCategory
    }
}