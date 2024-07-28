import { PrismaClient, User } from "@prisma/client";
import { PubSub } from "graphql-subscriptions";

type Context = {
    loggedInUser: User,
    client: PrismaClient,
    pubsub: PubSub
}

export type Resolver = (root:any, args:any, context:Context, info:any) => any;

export type Resolvers = {
    [key:string]: {
        [key:string]: Resolver
    }
}

