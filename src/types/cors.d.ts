declare module "cors" {
  import type { Request, Response, NextFunction } from "express";

  interface CorsOptions {
    origin?: string | string[] | ((origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => void);
    methods?: string[];
    allowedHeaders?: string[];
  }

  function cors(options?: CorsOptions): (req: Request, res: Response, next: NextFunction) => void;

  export default cors;
}
