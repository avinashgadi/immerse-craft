# 🚀 CloudVR Tours - Deployment Guide

## Environment Variables Setup

### For Local Development (.env)
```bash
# Supabase Configuration
VITE_SUPABASE_URL=https://emeuomodshkykagjgsdm.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVtZXVvbW9kc2hreWthZ2pnc2RtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc2OTk1NDEsImV4cCI6MjA3MzI3NTU0MX0.LO2ExQH839rDCroXHUuTqLnuPTQR7dmp3j95lho2dK8

# AI Chat Assistant (Choose ONE)
# Option 1: OpenRouter (Recommended)
VITE_OPENROUTER_API_KEY=sk-or-your-key-here
VITE_OPENROUTER_MODEL=openai/gpt-4o-mini
VITE_SITE_URL=http://localhost:8081

# Option 2: OpenAI (Alternative)
# VITE_OPENAI_API_KEY=sk-your-key-here
# VITE_OPENAI_MODEL=gpt-4o-mini

# Cloudinary (Optional - for image optimization)
VITE_CLOUDINARY_CLOUD_NAME=your-cloud-name
```

### For Production (Vercel/Netlify/etc.)

#### Vercel Deployment:
1. Go to your Vercel project dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Add these variables:

```bash
# Supabase Configuration
VITE_SUPABASE_URL=https://emeuomodshkykagjgsdm.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVtZXVvbW9kc2hreWthZ2pnc2RtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc2OTk1NDEsImV4cCI6MjA3MzI3NTU0MX0.LO2ExQH839rDCroXHUuTqLnuPTQR7dmp3j95lho2dK8

# AI Chat Assistant
VITE_OPENROUTER_API_KEY=sk-or-your-key-here
VITE_OPENROUTER_MODEL=openai/gpt-4o-mini
VITE_SITE_URL=https://your-app-name.vercel.app

# Cloudinary (Optional)
VITE_CLOUDINARY_CLOUD_NAME=your-cloud-name
```

#### Netlify Deployment:
1. Go to your Netlify site dashboard
2. Navigate to **Site settings** → **Environment variables**
3. Add the same variables as above, but update `VITE_SITE_URL` to your Netlify domain

## 🔧 Supabase Configuration

### 1. Update Site URL in Supabase Dashboard:
1. Go to [supabase.com](https://supabase.com) → Your Project
2. Navigate to **Authentication** → **URL Configuration**
3. Add your production domain to **Site URL**:
   - `https://your-app-name.vercel.app` (for Vercel)
   - `https://your-app-name.netlify.app` (for Netlify)

### 2. Update Redirect URLs:
Add these to **Redirect URLs** in Supabase:
- `https://your-app-name.vercel.app/auth`
- `https://your-app-name.vercel.app/auth?redirect=/`
- `https://your-app-name.vercel.app/`

### 3. Enable Google OAuth (Optional):
1. In Supabase Dashboard → **Authentication** → **Providers**
2. Enable **Google** provider
3. Add your Google OAuth credentials

## 🎯 AI Chat Assistant Setup

### OpenRouter (Recommended):
1. Go to [openrouter.ai](https://openrouter.ai)
2. Sign up and get your API key
3. Add to environment variables as shown above

### OpenAI (Alternative):
1. Go to [platform.openai.com](https://platform.openai.com)
2. Create API key
3. Add to environment variables as shown above

## 📸 Cloudinary Setup (Optional)

1. Go to [cloudinary.com](https://cloudinary.com)
2. Create free account
3. Get your cloud name from dashboard
4. Upload your destination images with these public IDs:
   - `immersive/dest-mount-fuji`
   - `immersive/dest-taj-mahal`
   - `immersive/dest-angkor-wat`
   - `immersive/dest-great-wall`
   - `immersive/dest-tokyo-shibuya`
   - `immersive/dest-petra`
   - `immersive/dest-borobudur`
   - `immersive/dest-bagan-temples`
   - `immersive/dest-ha-long-bay`
   - `immersive/dest-jeju-island`

## 🚀 Deployment Steps

### Vercel:
1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on push

### Netlify:
1. Connect your GitHub repository to Netlify
2. Add environment variables in Netlify dashboard
3. Deploy automatically on push

## ✅ Testing After Deployment

1. **Test Authentication:**
   - Try signing up with email
   - Try Google OAuth (if enabled)
   - Check email confirmation

2. **Test Chat Assistant:**
   - Click the chat bubble
   - Ask a question
   - Verify AI responses

3. **Test Destinations:**
   - Browse destinations page
   - Check image loading
   - Test search and filters

## 🔍 Troubleshooting

### Auth Issues:
- Check Supabase URL configuration
- Verify redirect URLs in Supabase dashboard
- Check browser console for errors

### Chat Issues:
- Verify API key is set correctly
- Check network tab for API calls
- Ensure environment variables are loaded

### Image Issues:
- Check Cloudinary configuration
- Verify image public IDs match
- Check fallback to local images

## 📝 Notes

- Never commit `.env` files to version control
- Use different API keys for development and production
- Monitor usage and costs for AI services
- Keep Supabase credentials secure
