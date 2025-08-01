import { Request, Response, Router } from "express";
// import { body, Result, ValidationError, validationResult } from 'express-validator' // ei toimi jostain syystä
import bcrypt from "bcrypt";
import jwt, { JwtPayload } from "jsonwebtoken";
import { validateToken } from "../middleware/validateToken";
import { User, IUser } from "../models/User";

const router: Router = Router();

router.post("/register", async (req: Request, res: Response) => {
  try {
    // express-validator doesen't work so cant do better validation
    if (!req.body.email || !req.body.password) {
      res.status(400).json({ message: "Bad request" });
      return;
    }
    const existingUser: IUser | null = await User.findOne({
      email: req.body.email,
    });
    if (existingUser) {
      res.status(403).json({ email: "email already in use" });
      return;
    }

    const salt: string = bcrypt.genSaltSync(10);
    const hash: string = bcrypt.hashSync(req.body.password, salt);

    User.create({
      email: req.body.email,
      password: hash,
      isAdmin: req.body.isAdmin || false,
    });

    res.status(200).json({ message: "User registered successfully" });
    return;
  } catch (error: any) {
    console.error(`Error during registration: ${error}`);
    res.status(500).json({ error: "Internal Server Error" });
    return;
  }
});

// dont ever do this in real world
router.get("/list", async (req: Request, res: Response) => {
  res.status(200).json(User);
});

// Get all users for admin panel
router.get(
  "/admin/users",
  validateToken,
  async (req: Request, res: Response) => {
    try {
      const users = await User.find({}, { password: 0 }); // Exclude password field
      res.status(200).json(users);
    } catch (error: any) {
      console.error(`Error fetching users: ${error}`);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },
);

router.post("/login", async (req: Request, res: Response) => {
  try {
    const user: IUser | null = await User.findOne({ email: req.body.email });

    console.log("User:", user);

    if (!user) {
      res.status(401).json({ message: "Login failed" });
      return;
    }

    if (bcrypt.compareSync(req.body.password, user.password)) {
      const jwtPayload: JwtPayload = {
        email: user.email,
        isAdmin: user.isAdmin,
      };
      const token: string = jwt.sign(jwtPayload, process.env.SECRET as string, {
        expiresIn: "1h",
      });

      res
        .status(200)
        .json({ success: true, token, expiresIn: "1h", isAdmin: user.isAdmin });
      return;
    }
    res.status(401).json({ message: "Login failed" });
    return;
  } catch (error: any) {
    console.error(`Error during user login: ${error}`);
    res.status(500).json({ error: "Internal Server Error" });
    return;
  }
});

export default router;
