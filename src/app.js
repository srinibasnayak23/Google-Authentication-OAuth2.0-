
import express from "express";
import session from "express-session";
import MongoStore from "connect-mongo";
import passport from "passport";
import cors from "cors";
import cookieParser from "cookie-parser";
import "./config/passport.js";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const app = express();

//  Middleware setup
app.use(cors({ origin: ["http://127.0.0.1:5500", "http://localhost:5500"], credentials: true }));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

//  Session management
app.use(
  session({
    secret:"hdfkjhklhkjhkjghgfghhjgds",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      //mongoUrl: process.env.MONGO_URI,
      mongoUrl: "mongodb+srv://devsrinibas_db_user:Ge85sJZgjBBQQuwA@freecluster.ju5itlx.mongodb.net/?appName=FreeCluster",
      collectionName: "sessions",
    }),
    cookie: {
      maxAge: 1000 * 60, 
    },
  })
);

//  Passport setup
app.use(passport.initialize());
app.use(passport.session());

export default app;
