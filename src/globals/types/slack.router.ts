import { Express } from 'express';

export type RouteHandler = (req: Express.Request, res: Express.Response) => Promise<any>;
