const { ObjectId } = require("mongodb");
const db = require("../db/mongo_db");

const Cafe = {
    collection: "cafes",

    async getCafesByNameOrAddr(target) {
        const queryJson = { $or: [{ "cafe_name": { "$regex": target, "$options": "i" } }, { "address": { "$regex": target, "$options": "i" } }] };
        const projection =  {cafe_name: true, starring: true, phone_number: true, address: true, business_hours: true, image_link: true}
        const cafes = await db.query(this.collection, "find", queryJson, projection);
        return (cafes);
    },

    async getCafeById(cafe_id){
        const queryJson = {_id : new ObjectId(cafe_id)};
        const cafe = await db.query(this.collection, "findOne", queryJson);
        return (cafe);
    }
}

module.exports = Cafe;  