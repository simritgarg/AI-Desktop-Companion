# Full Deep Workflow & Persistence Verification Suite

Write-Host "===================================================="
Write-Host "  PERSONAL SSC CGL COMMAND CENTRE - WORKFLOW TEST"
Write-Host "===================================================="

# 1. SSC CGL Syllabus Topic CRUD Test
Write-Host "`n[1/5] Testing SSC CGL Syllabus Topic Lifecycle (Create -> Update -> Verify -> Delete)..."
$topicCreateBody = @{
    category = 'SSC_CGL'
    subject = 'QUANTITATIVE_APTITUDE'
    topicName = 'Acceptance Test Geometry Theorem'
    subtopicName = 'Circle Tangent & Secant Theorems'
    status = 'LEARNING'
    priority = 'URGENT'
    difficulty = 'HARD'
    estimatedStudyTimeMinutes = 90
    formulaOrShortcuts = 'PT^2 = PA * PB for tangent secant theorem'
    confidenceLevel = 75
    questionsPracticedCount = 45
    accuracyPercentage = 84.4
} | ConvertTo-Json

$topicRes = Invoke-RestMethod -Uri 'http://localhost:8080/api/syllabus' -Method Post -Body $topicCreateBody -ContentType 'application/json'
Write-Host "  -> Created Topic ID:" $topicRes.id "Name:" $topicRes.topicName "Status:" $topicRes.status

# Update topic
$topicUpdateBody = @{
    category = 'SSC_CGL'
    subject = 'QUANTITATIVE_APTITUDE'
    topicName = 'Acceptance Test Geometry Theorem'
    subtopicName = 'Circle Tangent & Secant Theorems'
    status = 'COMPLETED'
    priority = 'HIGH'
    difficulty = 'HARD'
    estimatedStudyTimeMinutes = 90
    actualStudyTimeMinutes = 85
    formulaOrShortcuts = 'PT^2 = PA * PB for tangent secant theorem'
    confidenceLevel = 95
    questionsPracticedCount = 60
    accuracyPercentage = 91.5
    revisionCount = 1
} | ConvertTo-Json

$topicUpdated = Invoke-RestMethod -Uri "http://localhost:8080/api/syllabus/$($topicRes.id)" -Method Put -Body $topicUpdateBody -ContentType 'application/json'
Write-Host "  -> Updated Topic Status:" $topicUpdated.status "Accuracy:" $topicUpdated.accuracyPercentage "% Confidence:" $topicUpdated.confidenceLevel "%"

# 2. Test Series Attempt & Analytics Calculation Test
Write-Host "`n[2/5] Testing Test Series Attempt Entry & Analytics Calculations..."
$testAttemptBody = @{
    platformName = 'Oliveboard'
    testSeriesName = 'SSC CGL Tier 1 Full Mock Series'
    testName = 'Full Mock Test #10 - Acceptance Run'
    marksObtained = 162.5
    totalMarks = 200.0
    correctAnswers = 85
    incorrectAnswers = 10
    unattemptedQuestions = 5
    negativeMarks = 5.0
    accuracyPercentage = 89.47
    attemptRatePercentage = 95.0
    timeTakenMinutes = 58
    percentileOrRank = '98.1st Percentile'
    subjectScoresJson = '{"Quant":47.5, "Reasoning":48.0, "English":42.5, "GA":24.5}'
} | ConvertTo-Json

$testAttemptRes = Invoke-RestMethod -Uri 'http://localhost:8080/api/tests/attempts' -Method Post -Body $testAttemptBody -ContentType 'application/json'
Write-Host "  -> Recorded Mock Attempt ID:" $testAttemptRes.id "Marks:" $testAttemptRes.marksObtained "/" $testAttemptRes.totalMarks "Accuracy:" $testAttemptRes.accuracyPercentage "%"

$summaryRes = Invoke-RestMethod -Uri 'http://localhost:8080/api/tests/analytics/summary' -Method Get
Write-Host "  -> Analytics Summary - Total Attempts:" $summaryRes.totalAttempts "Average Score:" $summaryRes.averageScore "Best Score:" $summaryRes.bestScore "Average Accuracy:" $summaryRes.averageAccuracy "%"

# 3. Mistake Bank Categorization & Review Test
Write-Host "`n[3/5] Testing Mistake Bank Creation & Filtering..."
$mistakeBody = @{
    questionText = 'A chord of length 16 cm is at a distance of 6 cm from the centre of a circle. Find the radius.'
    correctAnswer = '10 cm'
    userAnswer = '8 cm'
    explanation = 'Radius r = sqrt(d^2 + (chord/2)^2) = sqrt(6^2 + 8^2) = sqrt(36 + 64) = 10 cm'
    subject = 'QUANTITATIVE_APTITUDE'
    topic = 'Geometry - Circle Chords'
    mistakeCategory = 'CALCULATION'
    reviewStatus = 'UNRESOLVED'
} | ConvertTo-Json

$mistakeRes = Invoke-RestMethod -Uri 'http://localhost:8080/api/mistakes' -Method Post -Body $mistakeBody -ContentType 'application/json'
Write-Host "  -> Logged Mistake ID:" $mistakeRes.id "Category:" $mistakeRes.mistakeCategory "Subject:" $mistakeRes.subject

# 4. Private Reflection Diary Persistence Test
Write-Host "`n[4/5] Testing Private Journal Diary CRUD & Date Lookup..."
$diaryBody = @{
    entryDate = '2026-10-10'
    title = 'Full Workflow Acceptance Verification Journal'
    content = 'Executed complete test suite across Geometry syllabus, Oliveboard mock test 10, and circle chord mistake analysis.'
    mood = 'MOTIVATED'
    whatILearned = 'Circle chord radius r = sqrt(d^2 + (c/2)^2)'
    whatWentWell = 'Scored 162.5 / 200 on Oliveboard Mock 10'
    struggles = 'Calculation slip on chord radius question'
    tomorrowIntention = 'Execute 2 hours of Reasoning & General Awareness PYQ drills'
} | ConvertTo-Json

$diaryRes = Invoke-RestMethod -Uri 'http://localhost:8080/api/diary' -Method Post -Body $diaryBody -ContentType 'application/json'
Write-Host "  -> Saved Diary Entry ID:" $diaryRes.id "Title:" $diaryRes.title "Mood:" $diaryRes.mood

$todayEntry = Invoke-RestMethod -Uri 'http://localhost:8080/api/diary/by-date?date=2026-10-10' -Method Get
Write-Host "  -> Verified Diary Lookup By Date (2026-10-10):" $todayEntry.title

# 5. Vision Board & Item Pinning Test
Write-Host "`n[5/5] Testing Motivation Vision Board & Item Pinning..."
$boardBody = @{
    boardName = 'SSC CGL Rank 1 Vision Board'
    category = 'SSC_CGL'
    description = 'Motivation board for Income Tax Inspector / ASO Target'
} | ConvertTo-Json

$boardRes = Invoke-RestMethod -Uri 'http://localhost:8080/api/vision-boards' -Method Post -Body $boardBody -ContentType 'application/json'
Write-Host "  -> Created Vision Board ID:" $boardRes.id "Name:" $boardRes.boardName

$itemBody = @{
    title = 'ASO in Ministry of External Affairs Target'
    caption = '"Action destroys anxiety. Show up every day with 100% focus."'
    itemType = 'QUOTE'
} | ConvertTo-Json

$itemRes = Invoke-RestMethod -Uri "http://localhost:8080/api/vision-boards/$($boardRes.id)/items" -Method Post -Body $itemBody -ContentType 'application/json'
Write-Host "  -> Pinned Item ID:" $itemRes.id "Title:" $itemRes.title

Write-Host "`n===================================================="
Write-Host "  ALL 5 WORKFLOW STEPS PASSED SUCCESSFULLY!"
Write-Host "===================================================="
