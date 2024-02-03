const {Schema, model} = require("mongoose")


const postSchema = new Schema ({
    title: {type:String, require:true},
    category: {type:String, enum:["Uncategorized","Agriculture", "Business", "Education", "Entertainment", "Art", "Investment",  "Weather"], message:"VALUE is npt supported"},
    description: {type:String, require:true},
    thumbnail: {type:String, require:true},
    creator: {type:Schema.Types.ObjectId, ref:"User"},
},{timestamps:true}
)

module.exports = model("post",postSchema)