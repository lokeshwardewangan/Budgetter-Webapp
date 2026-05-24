import multer from 'multer';

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, './public/uploads'),
  filename: (_req, file, cb) => cb(null, file.originalname),
});

export const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (_req, file, cb) => {
    if (file.mimetype.startsWith('image/')) cb(null, true);
    else cb(new Error('Only image uploads are allowed'));
  },
});
