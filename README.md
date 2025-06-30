# Dozier Tech Group Website

A modern, professional website for Dozier Tech Group built with HTML, CSS, and JavaScript.

## Features

- **Responsive Design**: Works perfectly on desktop, tablet, and mobile devices
- **Modern UI/UX**: Clean, professional design with smooth animations
- **Service Showcase**: Detailed presentation of four main AI consulting services:
  - Local AI Integration into Business Processes
  - MCP Setup and Installation
  - Custom Model Training and Solutions
  - AI-Enabled Software and Components
- **Contact Form**: Functional contact form with validation
- **SEO Optimized**: Proper meta tags and semantic HTML structure
- **Fast Loading**: Optimized images and efficient CSS/JS

## Deployment on GitHub Pages

### Method 1: Direct Upload
1. Create a new repository on GitHub
2. Upload all files from this folder to the repository
3. Go to repository Settings > Pages
4. Select "Deploy from a branch" and choose "main" branch
5. Your site will be available at `https://yourusername.github.io/repository-name`

### Method 2: Using Git Commands
```bash
# Initialize git repository
git init

# Add all files
git add .

# Commit files
git commit -m "Initial commit: AI Solutions website"

# Add your GitHub repository as remote
git remote add origin https://github.com/yourusername/repository-name.git

# Push to GitHub
git push -u origin main
```

Then enable GitHub Pages in repository settings.

### Custom Domain Setup
1. Add a `CNAME` file to the root directory containing your domain name
2. Configure your domain's DNS settings to point to GitHub Pages
3. Enable "Enforce HTTPS" in GitHub Pages settings

## File Structure

```
ai-consulting-website/
├── index.html          # Main HTML file
├── favicon.svg         # Website favicon
├── README.md          # This file
├── css/
│   └── styles.css     # All CSS styles
├── js/
│   └── script.js      # JavaScript functionality
└── images/
    ├── logo.png       # Company logo
    ├── hero-bg.png    # Hero section background
    ├── about-team.jpg # About section image
    └── collaboration.jpg # Additional image
```

## Customization

### Colors
The website uses a blue and purple gradient color scheme. Main colors:
- Primary Blue: `#2563eb`
- Secondary Purple: `#7c3aed`
- Text Dark: `#1e293b`
- Text Light: `#64748b`

### Content
- Update company information in `index.html`
- Modify services, contact details, and about section as needed
- Replace images in the `images/` folder with your own

### Styling
- All styles are in `css/styles.css`
- Responsive breakpoints: 768px (tablet) and 480px (mobile)
- Uses Inter font from Google Fonts

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Performance

- Optimized images
- Minified CSS and JavaScript
- Fast loading animations
- Mobile-first responsive design

## License

This website template is provided as-is for your AI consulting business. Feel free to modify and customize as needed.

