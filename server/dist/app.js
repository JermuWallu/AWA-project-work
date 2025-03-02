"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const card_1 = __importDefault(require("./routes/card"));
const user_1 = __importDefault(require("./routes/user"));
const app = (0, express_1.default)();
const port = 1234;
mongoose_1.default.connect('mongodb://localhost:1234/api');
app.use(express_1.default.json());
app.use('/api', card_1.default);
app.use('/user', user_1.default);
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
