# API Functional Persistence Test Script

Write-Host "1. Testing Syllabus API POST & GET..."
$syllabusBody = @{
    category = 'SSC_CGL'
    subject = 'QUANTITATIVE_APTITUDE'
    topicName = 'Geometry Theorems & Triangle Proofs'
    subtopicName = 'Incentre & Circumcentre Properties'
    status = 'LEARNING'
    priority = 'HIGH'
    formulaOrShortcuts = 'Incentre angle = 90 + A/2'
    confidenceLevel = 85
} | ConvertTo-Json

$syllabusRes = Invoke-RestMethod -Uri 'http://localhost:8080/api/syllabus' -Method Post -Body $syllabusBody -ContentType 'application/json'
Write-Host "Created Syllabus Topic ID:" $syllabusRes.id "Name:" $syllabusRes.topicName

$syllabusList = Invoke-RestMethod -Uri 'http://localhost:8080/api/syllabus?category=SSC_CGL' -Method Get
Write-Host "Fetched Syllabus Count:" $syllabusList.Count

Write-Host "`n2. Testing Test Series Attempts API POST & GET..."
$testBody = @{
    platformName = 'Oliveboard'
    testName = 'SSC CGL Tier 1 Full Mock #06'
    marksObtained = 158.5
    totalMarks = 200
    correctAnswers = 84
    incorrectAnswers = 10
    unattemptedQuestions = 6
    accuracyPercentage = 89.3
    percentileOrRank = '97.2th Percentile'
} | ConvertTo-Json

$testRes = Invoke-RestMethod -Uri 'http://localhost:8080/api/tests/attempts' -Method Post -Body $testBody -ContentType 'application/json'
Write-Host "Created Test Attempt ID:" $testRes.id "Marks:" $testRes.marksObtained

$testList = Invoke-RestMethod -Uri 'http://localhost:8080/api/tests/attempts' -Method Get
Write-Host "Fetched Test Attempts Count:" $testList.Count

Write-Host "`n3. Testing Mistake Bank API POST & GET..."
$mistakeBody = @{
    questionText = 'If speed is increased by 20%, time decreases by what %?'
    correctAnswer = '16.67%'
    userAnswer = '20%'
    explanation = 'Time ratio = 1/(1+1/5) = 5/6, so decrease is 1/6 = 16.67%'
    subject = 'QUANTITATIVE_APTITUDE'
    mistakeCategory = 'CONCEPTUAL'
} | ConvertTo-Json

$mistakeRes = Invoke-RestMethod -Uri 'http://localhost:8080/api/mistakes' -Method Post -Body $mistakeBody -ContentType 'application/json'
Write-Host "Created Mistake Record ID:" $mistakeRes.id "Category:" $mistakeRes.mistakeCategory

$mistakeList = Invoke-RestMethod -Uri 'http://localhost:8080/api/mistakes' -Method Get
Write-Host "Fetched Mistakes Count:" $mistakeList.Count

Write-Host "`n4. Testing Private Diary API POST & GET..."
$diaryBody = @{
    title = 'Full Focus Day & Oliveboard Mock Verification'
    content = 'Completed 3 hours of Quant study on Geometry Theorems and logged 1 Oliveboard mock attempt.'
    mood = 'FOCUSED'
    whatILearned = 'Incentre angle formula: 90 + A/2'
    tomorrowIntention = 'Execute 50 DSA practice questions and review mistake bank'
} | ConvertTo-Json

$diaryRes = Invoke-RestMethod -Uri 'http://localhost:8080/api/diary' -Method Post -Body $diaryBody -ContentType 'application/json'
Write-Host "Created Diary Entry ID:" $diaryRes.id "Title:" $diaryRes.title

$diaryList = Invoke-RestMethod -Uri 'http://localhost:8080/api/diary' -Method Get
Write-Host "Fetched Diary Entries Count:" $diaryList.Count
