# FINAL COMPREHENSIVE TEST - All Endpoints & CRUD Operations
Write-Host "=============================================" -ForegroundColor Cyan
Write-Host " AI Desktop Companion - Full System Test" -ForegroundColor Cyan  
Write-Host "=============================================" -ForegroundColor Cyan
Write-Host ""

$passed = 0
$failed = 0

function Test-Endpoint {
    param([string]$path, [string]$desc, [string]$method = "GET", [string]$body = $null)
    try {
        $params = @{
            Uri = "http://localhost:8080$path"
            Method = $method
            UseBasicParsing = $true
            TimeoutSec = 10
        }
        if ($body) {
            $params.Body = $body
            $params.ContentType = "application/json"
        }
        $r = Invoke-WebRequest @params
        $bodyLen = $r.Content.Length
        Write-Host "  PASS $method $path ($desc) => $($r.StatusCode) [$bodyLen bytes]" -ForegroundColor Green
        $script:passed++
        return $r.Content
    } catch {
        $code = $_.Exception.Response.StatusCode.value__
        if ($code) {
            Write-Host "  FAIL $method $path ($desc) => HTTP $code" -ForegroundColor Red
        } else {
            Write-Host "  FAIL $method $path ($desc) => $($_.Exception.Message)" -ForegroundColor Red
        }
        $script:failed++
        return $null
    }
}

# === SECTION 1: Core CRUD Endpoints ===
Write-Host "[1] CORE CRUD ENDPOINTS" -ForegroundColor Yellow
Test-Endpoint "/api/tasks" "Tasks List"
Test-Endpoint "/api/goals" "Goals List"
Test-Endpoint "/api/habits" "Habits List"
Test-Endpoint "/api/reminders" "Reminders List"
Test-Endpoint "/api/diary" "Diary Entries"
Test-Endpoint "/api/notes" "Notes List"
Test-Endpoint "/api/mistakes" "Mistake Bank"
Test-Endpoint "/api/syllabus" "Syllabus Topics"
Test-Endpoint "/api/vision-boards" "Vision Boards"

# === SECTION 2: Sub-path Endpoints ===
Write-Host "`n[2] SUB-PATH ENDPOINTS" -ForegroundColor Yellow
Test-Endpoint "/api/tests/platforms" "Test Platforms"
Test-Endpoint "/api/tests/attempts" "Test Attempts"
Test-Endpoint "/api/tests/analytics/summary" "Test Analytics"
Test-Endpoint "/api/analytics/today" "Today Stats"
Test-Endpoint "/api/analytics/summary" "Analytics Summary"
Test-Endpoint "/api/focus/current" "Current Focus Session"
Test-Endpoint "/api/ai/recommend" "AI Recommendation"
Test-Endpoint "/api/ai/analyze-day" "AI Daily Analysis"
Test-Endpoint "/api/health" "Health Check"

# === SECTION 3: Task Full CRUD ===
Write-Host "`n[3] TASK FULL CRUD" -ForegroundColor Yellow
$taskJson = '{"title":"Test CRUD Task","description":"Auto-test","priority":"HIGH","estimatedMinutes":30,"status":"TODO"}'
$result = Test-Endpoint "/api/tasks" "Create Task" "POST" $taskJson
if ($result) {
    $taskObj = $result | ConvertFrom-Json
    $tid = $taskObj.id
    Write-Host "    -> Created Task ID: $tid" -ForegroundColor DarkGray
    Test-Endpoint "/api/tasks/$tid" "Read Task $tid"
    $updateJson = '{"title":"Updated CRUD Task","description":"Updated","priority":"HIGH","estimatedMinutes":30,"status":"COMPLETED"}'
    Test-Endpoint "/api/tasks/$tid" "Update Task $tid" "PUT" $updateJson
    Test-Endpoint "/api/tasks/$tid" "Delete Task $tid" "DELETE"
}

# === SECTION 4: Goal Full CRUD ===
Write-Host "`n[4] GOAL FULL CRUD" -ForegroundColor Yellow
$goalJson = '{"title":"Test CRUD Goal","description":"Auto-test goal","goalType":"SHORT_TERM","targetDate":"2026-12-31","status":"IN_PROGRESS","progressPercentage":0}'
$result = Test-Endpoint "/api/goals" "Create Goal" "POST" $goalJson
if ($result) {
    $goalObj = $result | ConvertFrom-Json
    $gid = $goalObj.id
    Write-Host "    -> Created Goal ID: $gid" -ForegroundColor DarkGray
    Test-Endpoint "/api/goals/$gid" "Read Goal $gid"
    $updateJson = '{"title":"Updated Goal","description":"Updated","goalType":"SHORT_TERM","targetDate":"2026-12-31","status":"COMPLETED","progressPercentage":100}'
    Test-Endpoint "/api/goals/$gid" "Update Goal $gid" "PUT" $updateJson
    Test-Endpoint "/api/goals/$gid" "Delete Goal $gid" "DELETE"
}

# === SECTION 5: Diary CRUD ===
Write-Host "`n[5] DIARY CRUD" -ForegroundColor Yellow
$diaryJson = '{"title":"Test Diary","content":"Today was productive","mood":"HAPPY","highlights":"Completed testing"}'
$result = Test-Endpoint "/api/diary" "Create Diary Entry" "POST" $diaryJson
if ($result) {
    $diaryObj = $result | ConvertFrom-Json
    $did = $diaryObj.id
    Write-Host "    -> Created Diary ID: $did" -ForegroundColor DarkGray
    Test-Endpoint "/api/diary/$did" "Read Diary $did"
    Test-Endpoint "/api/diary/$did" "Delete Diary $did" "DELETE"
}

# === SECTION 6: Syllabus CRUD ===
Write-Host "`n[6] SYLLABUS CRUD" -ForegroundColor Yellow
$syllJson = '{"category":"SSC_CGL","subject":"Quantitative Aptitude","topicName":"Percentage","status":"NOT_STARTED","priority":"HIGH","difficulty":"MODERATE"}'
$result = Test-Endpoint "/api/syllabus" "Create Topic" "POST" $syllJson
if ($result) {
    $syllObj = $result | ConvertFrom-Json
    $sid = $syllObj.id
    Write-Host "    -> Created Topic ID: $sid" -ForegroundColor DarkGray
    $updateJson = '{"category":"SSC_CGL","subject":"Quantitative Aptitude","topicName":"Percentage","status":"COMPLETED","priority":"HIGH","difficulty":"MODERATE","confidenceLevel":85}'
    Test-Endpoint "/api/syllabus/$sid" "Update Topic $sid" "PUT" $updateJson
    Test-Endpoint "/api/syllabus/$sid" "Delete Topic $sid" "DELETE"
}

# === SECTION 7: Frontend Routes ===
Write-Host "`n[7] FRONTEND ROUTES" -ForegroundColor Yellow
$routes = @('/', '/analytics', '/calendar', '/companion', '/focus', '/goals', '/habits', '/mistakes', '/motivation', '/revision', '/settings', '/tasks', '/test-series', '/ssc-cgl', '/it-career', '/notes', '/diary')
foreach ($route in $routes) {
    try {
        $r = Invoke-WebRequest -Uri "http://localhost:3000$route" -UseBasicParsing -TimeoutSec 10
        Write-Host "  PASS GET $route => $($r.StatusCode)" -ForegroundColor Green
        $script:passed++
    } catch {
        Write-Host "  FAIL GET $route => $($_.Exception.Message)" -ForegroundColor Red
        $script:failed++
    }
}

# === SUMMARY ===
Write-Host "`n=============================================" -ForegroundColor Cyan
Write-Host " RESULTS: $passed PASSED / $failed FAILED" -ForegroundColor $(if ($failed -eq 0) { 'Green' } else { 'Yellow' })
Write-Host "=============================================" -ForegroundColor Cyan
