Write-Host "Adding files to git..." -ForegroundColor Green
git add .

Write-Host "Committing changes..." -ForegroundColor Green
git commit -m "feat: Add veterinary practice and control number recommendation features

- Added veterinary practice recommendation service with nearby clinic information
- Added veterinary control number recommendation service with available control types
- Updated services layout to accommodate 5 services instead of 3
- Added showVetPracticeRecommendation() function with clinic details
- Added showVetControlNumberRecommendation() function with control number types
- Updated CSS grid layout for better responsiveness
- Added authentication checks for recommendation features
- Created RECOMMENDATION-FEATURES-ADDED.md documentation

Features:
- Location-based veterinary clinic recommendations
- Control number type information with requirements
- User authentication required for access
- Responsive design for all devices
- Professional card-based information display"

Write-Host "Pushing to GitHub..." -ForegroundColor Green
git push origin main

Write-Host "GitHub update complete!" -ForegroundColor Green
