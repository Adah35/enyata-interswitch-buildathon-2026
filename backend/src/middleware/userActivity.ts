// import { Request, Response, NextFunction } from "express";
// import { getRepository } from "../connection/data-source";
// import { User } from "../entity/user";
// import { Admin } from "../entity/admin";
// import { UserInteractionService } from "../services/userInteraction";


// // WIP: add other tracking info, add a loger
// export async function trackUserActivity(req: Request, res: Response) {
//   if (!req["user"]) return
//     const userRepository = getRepository(User);
//   await userRepository.update(req["user"].id, { lastActive: new Date() });
// }
// export async function trackAdminActivity(req: Request, res: Response) {
//   if (!req["user"]) return
//   const userRepository = getRepository(Admin);
//   await userRepository.update(req["user"].id, { lastActive: new Date() });
// }

// const interactionService = new UserInteractionService();


// const getMethodFiltering = (urlPath: string, userId: string) => {
//   // CHECK PATH AND HANDLE
// }
// const postMethodFiltering = () => { }

// export const filterUserOnPlatform = async (req: Request, res: Response, next: NextFunction) => {
//   const userId = req["user"]?.id;
//   const requestMethod = req.method
//   const params = req.params
//   const query = req.query
//   const file = req.file
//   const files = req.files
//   const url = req.url

//   switch (requestMethod) {
//     case "GET":
//       getMethodFiltering(url, userId)
//       break;
//     case "POST":
//       getMethodFiltering(url, userId)
//       break;
//     case "PATCH":
//       getMethodFiltering(url, userId)
//       break;
//     case "DELETE":
//       getMethodFiltering(url, userId)
//       break;

//     default:
//       break;
//   }
//   next();
// }

