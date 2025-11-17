# Render Deployment Configuration

## Backend Deployment

The backend is configured to deploy from the `backend` directory.

### Option 1: Using render.yaml (Recommended)

The `render.yaml` file is configured with:
- **Root Directory**: `backend`
- **Build Command**: `npm install`
- **Start Command**: `npm start`

Render will automatically detect and use this configuration.

### Option 2: Manual Configuration in Render Dashboard

If configuring manually:

1. **Root Directory**: Set to `backend`
2. **Build Command**: `npm install`
3. **Start Command**: `npm start`
4. **Node Version**: 18.x or higher

### Required Environment Variables

Set these in Render dashboard:

- `NODE_ENV` = `production`
- `PORT` = (Auto-assigned by Render, or set to `2025`)
- `MONGODB_URI` = Your MongoDB connection string
- `JWT_SECRET` = Your JWT secret key
- `CLOUDINARY_CLOUD_NAME` = Your Cloudinary cloud name
- `CLOUDINARY_API_KEY` = Your Cloudinary API key
- `CLOUDINARY_API_SECRET` = Your Cloudinary API secret
- `SMTP_HOST` = Your SMTP host (optional)
- `SMTP_PORT` = Your SMTP port (optional)
- `SMTP_USER` = Your SMTP user (optional)
- `SMTP_PASS` = Your SMTP password (optional)

### Testing Deployment

After deployment, test the API:

```bash
curl https://your-app-name.onrender.com/api/test
```

Expected response:
```json
{
  "status": "OK",
  "message": "SkillForge API is running!"
}
```

