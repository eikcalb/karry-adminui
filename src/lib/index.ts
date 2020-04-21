import { createContext } from "react";
import { Application } from '@eikcalb/owa_core'

export const APPLICATION_CONTEXT = createContext<Application>(new Application())