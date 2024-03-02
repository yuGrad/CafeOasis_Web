const db = require("../db/mongo_db");

const Cafe = {
    collection: "cafes",

    async getCafesbyNameOrAddr(target) {
        const queryJson = { $or: [{ "cafe_name": { "$regex": target, "$options": "i" } }, { "address": { "$regex": target, "$options": "i" } }] };
        const cafes = await db.query(this.collection, "find", queryJson);
        return (cafes);
    }
}

module.exports = Cafe;  