import { Router } from 'express';
import authRouter from './auth.route';
import userRouter from './user.route';
import taskRouter from './task.route';
import bidRouter from './bid.route';
import paymentRouter from './payment.route';
import webhookRouter from './webhook.route';

export const rootRoute = Router();

rootRoute.use('/auth', authRouter);
rootRoute.use('/users', userRouter);
rootRoute.use('/tasks', taskRouter);
rootRoute.use('/bids', bidRouter);
rootRoute.use('/payments', paymentRouter);
rootRoute.use('/webhooks', webhookRouter);

