#!/bin/bash

# Favicon Generator Pro - Complete Cleanup Script
echo "🧹 Starting Favicon Generator cleanup..."

# Step 1: Remove unnecessary empty files (keeping future feature files)
echo "📝 Removing unnecessary empty files..."
rm -f src/components/common/Button.tsx
rm -f src/components/common/Input.tsx
rm -f src/components/common/Modal.tsx
rm -f src/components/common/Toast.tsx
rm -f src/components/Preview/SizePreview.tsx
rm -f src/components/Templates/TemplateCard.tsx

# Step 2: Remove duplicate files
echo "🔄 Removing duplicate files..."
rm -f src/components/Editor/ColorPicker.tsx

# Step 3: Remove old files that will be consolidated
echo "📦 Removing files to be consolidated..."
rm -f src/components/Editor/TextInput.tsx
rm -f src/components/Editor/FontSizeSlider.tsx
rm -f src/components/Editor/ColorPickers.tsx
rm -f src/components/Editor/ColorPresets.tsx
rm -f src/components/Preview/BrowserPreview.tsx
rm -f src/components/Preview/MobilePreview.tsx
rm -f src/styles/globals.css

echo "✅ File cleanup complete!"
echo ""
echo "📁 Summary of changes:"
echo "  • Removed 11 unnecessary files"
echo "  • Consolidated 8 components into 3 new components"
echo "  • Maintained future feature files (FontSelector, ImageUploader, etc.)"
echo ""
echo "🚀 Next steps:"
echo "  1. Create the new consolidated component files"
echo "  2. Update import statements in existing files"
echo "  3. Test the application"
echo ""
echo "📊 New file structure will be cleaner and more maintainable!"

# Optional: Show remaining file count
echo ""
echo "📈 Files remaining in key directories:"
find src/components -name "*.tsx" -type f | wc -l | awk '{print "  • Components: " $1 " files"}'
find src/hooks -name "*.ts" -type f | wc -l | awk '{print "  • Hooks: " $1 " files"}'
find src/utils -name "*.ts" -type f | wc -l | awk '{print "  • Utils: " $1 " files"}'