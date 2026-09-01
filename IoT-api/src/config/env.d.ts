declare namespace NodeJS {
  interface ProcessEnv {
    DATABASE_URL: string;
    PORT?: string;
    JWT_SECRET: string;
    JWT_REFRESH_SECRET: string;
    JWT_EXPIRES_IN: string;
    JWT_REFRESH_EXPIRES_IN: string;
    ADMIN_EMAIL: string;
    ADMIN_PASSWORD: string;
  }
}

type AuthUser = {
  id: number;
  email: string;
  name: string | null;
  image: string | null;
  role: string;
  createdAt: Date;
};

declare namespace Express {
  namespace Multer {
    interface File {
      fieldname: string;
      originalname: string;
      encoding: string;
      mimetype: string;
      size: number;
      destination: string;
      filename: string;
      path: string;
      buffer: Buffer;
    }
  }

  interface Request {
    user: AuthUser | null;
    file?: Multer.File;
  }
}
