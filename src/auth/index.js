import express from 'express'

import { phoneRouter } from './2fa'
import { mailSentRouter} from "./mailSent";
import { signupMentorRouter } from "./signupMentor-router";
import {signupMenteeRouter} from "./signupMentee-router";

const authRoutes = express();

authRoutes.use(phoneRouter)
authRoutes.use(signupMenteeRouter)
authRoutes.use(signupMentorRouter)
authRoutes.use(mailSentRouter)

export { authRoutes }
