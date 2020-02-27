import { Express } from 'express';
import {RouteHandler} from "../types/slack.router";


export class SlackRouter {
    request: Express.Request;
    resuult: Express.Response;
    handler: RouteHandler;

}
