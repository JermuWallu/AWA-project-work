"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const morgan_1 = __importDefault(require("morgan"));
const mongoose_1 = __importDefault(require("mongoose"));
const cors_1 = __importDefault(require("cors")); // Import the cors package
const column_1 = __importDefault(require("./routes/column"));
const card_1 = __importDefault(require("./routes/card"));
const user_1 = __importDefault(require("./routes/user"));
dotenv_1.default.config();
// Basic express server stuff
const app = (0, express_1.default)();
const port = parseInt(process.env.PORT) || 8001;
// Mongoose and mongoDB
const mongoDB = 'mongodb://127.0.0.1:27017/testdb';
mongoose_1.default.connect(mongoDB);
mongoose_1.default.Promise = Promise;
const db = mongoose_1.default.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error :('));
// Middleware
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
app.use((0, morgan_1.default)('dev'));
// Configure CORS
app.use((0, cors_1.default)({
    origin: 'http://localhost:3000', // Allow requests from your client
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true, // Allow cookies to be sent with requests
}));
// Routes
app.use('/api', column_1.default);
app.use('/api', card_1.default);
app.use('/user', user_1.default);
// Port listening methods
app.listen(port, () => {
    console.log(`Server running on port http://127.0.0.1:${port}`);
});
