import mongoose, { mongo } from "mongoose";

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: false
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: false,
        ref: "users"
    }
})

const Category = mongoose.models.categories || mongoose.model('categories', categorySchema);
export default Category;