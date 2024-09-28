import { CategoryService } from "../../services/v1/categoryService";
import { Response, Request } from "express";
import { validate } from "../../utils/zodValidation";
import { categoryCreateValidation } from "../../validations/category/create";
import { HttpBadRequestHandler, HttpCreatedHandler, HttpFetchedHandler } from "../../helpers/httpExceptionHandler";
import { transformToObjectId } from "../../helpers/helper";

const { save: saveCategory, updateCategory: updateCategoryById, deleteCategory: deleteCategoryById, getAllCategories } = CategoryService()
export const CategoryController = () => {
    const createCategory = async (req: Request, res: Response) => {
        try {
            const body = req.body;
            const userId = req.user as string;
            const validationResult = validate(body, categoryCreateValidation);
            if (validationResult) {
                return HttpBadRequestHandler(res, validationResult);
            }

            const savedCategory = await saveCategory({...body, userId});
            return HttpCreatedHandler(res, {
                message: "Category created successfully.",
                success: true,
                data: savedCategory,
            });
        } catch (error: any) {
            return HttpBadRequestHandler(res, { error: error.message });
        }
    }

    const getCategoriesByUser = async (req: Request, res: Response) => {
        try {
            const userId = req.user as string;
            const categories = await getAllCategories(userId)
            if (categories.length < 1) {
                return HttpBadRequestHandler(res, {message: "No categories associated with user id"})
            }

            return HttpFetchedHandler(res, {
                message: "Categories are being caught successfully!",
                success: true,
                data: categories
            })
        } catch (error: any) {
            return HttpBadRequestHandler(res, {error: error.message})
        }
    }

    const updateCategory = async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            const body = req.body;
            const userId = req.user as string;
            const validationResult = validate(body, categoryCreateValidation);
            if (validationResult) {
                return HttpBadRequestHandler(res, validationResult);
            }

            const updatedCategory = await updateCategoryById(id, { ...body, userId });
            if (!updatedCategory) {
                return HttpBadRequestHandler(res, {message: "Category not found."})
            }
            return HttpCreatedHandler(res, {
                success: true,
                data: updatedCategory,
                message: "Category updated successfully!"
            })
        } catch (error: any) {
            return HttpBadRequestHandler(res, {error: error.message})
        }
    }

    const deleteCategory = async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            const userId = req.user as string;
            await deleteCategoryById(id, { userId });
            return HttpCreatedHandler(res, {
                success: true,
                message: "Category deleted successfully!"
            })
        } catch (error: any) {
            return HttpBadRequestHandler(res, {error: error.message})
        }
    }

    return { createCategory, updateCategory, deleteCategory, getCategoriesByUser }
}